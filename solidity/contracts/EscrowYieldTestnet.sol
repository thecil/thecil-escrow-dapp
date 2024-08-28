// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {ReserveLogic} from "@aave/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol";
import {ReserveConfiguration} from "@aave/core-v3/contracts/protocol/libraries/configuration/ReserveConfiguration.sol";
import {Errors} from "@aave/core-v3/contracts/protocol/libraries/helpers/Errors.sol";
import "./EscrowVariables.sol";

import "hardhat/console.sol";

/// @title An escrow contract with yield from aave
/// @author thecil - Carlos Zambrano
/// @notice Allow an user to create an escrow transaction with a timelock and in the mean time, the funds are being yield on AAVE.
/// @dev AAVE testnet tokens supported, escrow tx funds deposited to aave pool for yield.
contract EscrowYieldTestnet is
    EscrowVariables,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    using ReserveConfiguration for DataTypes.ReserveConfigurationMap;

    // Addresses register of the protocol for a particular market. This contract is immutable and the address will never change.
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    // It exposes the liquidity management methods that can be invoked using either Solidity or Web3 libraries.
    IPool public immutable POOL;

    constructor(address _addressProvider) Ownable(_msgSender()) {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
    }

    // create a new escrow tx using a token
    function createEscrowTransaction(
        address _beneficiary,
        address _tokenAddr,
        uint256 _tokenAmount,
        uint _unlockTime
    ) external whenNotPaused {
        // get pool asset config
        DataTypes.ReserveConfigurationMap
            memory _tokenReserveConfiguration = POOL.getConfiguration(
                _tokenAddr
            );

        // get reserver statuses
        (
            bool isActive,
            bool isFrozen,
            ,
            ,
            bool isPaused
        ) = _tokenReserveConfiguration.getFlags();
        // verify reserve statuses
        if (!isActive) revert(Errors.RESERVE_INACTIVE);
        if (isPaused) revert(Errors.RESERVE_PAUSED);
        if (isFrozen) revert(Errors.RESERVE_FROZEN);

        // verify if initiator and beneficiary have an active escrow tx id with status created or Dispute.
        // only 1 active escrow tx between initiator and beneficiary
        uint _escrowActiveTxId = activeUserBeneficiaryEscrowTxMap[_msgSender()][
            _beneficiary
        ];
        EscrowTransaction memory _escrowTransaction = escrowTxsMap[
            _escrowActiveTxId
        ];
        if (
            (_escrowActiveTxId > 0 &&
                _escrowTransaction.status == EscrowStatus.Created) ||
            _escrowTransaction.status == EscrowStatus.Dispute
        )
            revert AlreadyActiveEscrowTx(
                _escrowActiveTxId,
                _msgSender(),
                _beneficiary
            );

        // // transfer funds to contract
        IERC20 token = IERC20(_tokenAddr);
        token.transferFrom(_msgSender(), address(this), _tokenAmount);

        // // verify allowance is enough from contract to pool
        uint256 allowance = IERC20(_tokenAddr).allowance(
            address(this),
            address(POOL)
        );
        if (allowance < uint256(_tokenAmount)) {
            // approve pool to spent tokens as caller: contract
            (bool successApprove, ) = _tokenAddr.call(
                abi.encodeWithSignature(
                    "approve(address,uint256)",
                    address(POOL),
                    uint256(_tokenAmount)
                )
            );

            if (!successApprove) revert("approve error");
        }
        // supply tokens to pool as caller: contract
        (bool successSupply, ) = address(POOL).call(
            abi.encodeWithSignature(
                "supply(address,uint256,address,uint16)",
                _tokenAddr,
                _tokenAmount,
                address(this),
                0
            )
        );
        if (successSupply == false) revert("error supply");

        // increase tx counter to get a new number for this tx as id
        counterEscrowTransactions++;
        // add tx id to users map
        userEscrowsMap[_msgSender()].push(counterEscrowTransactions);
        // add tx id as active escrow tx
        activeUserBeneficiaryEscrowTxMap[_msgSender()][
            _beneficiary
        ] = counterEscrowTransactions;
        // create tx
        EscrowTransaction memory newEscrowTransaction = EscrowTransaction(
            payable(_beneficiary),
            _msgSender(),
            _tokenAddr,
            _tokenAmount,
            _unlockTime,
            EscrowStatus.Created
        );
        // add tx to escrows map
        escrowTxsMap[counterEscrowTransactions] = newEscrowTransaction;
        emit TransactionCreated(
            _beneficiary,
            _msgSender(),
            _tokenAddr,
            _tokenAmount,
            _unlockTime
        );
    }

    // approve an escrow tx id
    function approveEscrowTransaction(
        uint _escrowTxId
    )
        public
        validateEscrowTx(_msgSender(), _escrowTxId, EscrowStatus.Created)
        whenNotPaused
    {
        // verify escrow tx
        EscrowTransaction storage _escrowTx = escrowTxsMap[_escrowTxId];
        if (block.timestamp < _escrowTx.unlockTime)
            revert UnlockTimeNotReached(_escrowTx.unlockTime, block.timestamp);
        // mark escrow tx as approved
        _escrowTx.status = EscrowStatus.Approved;
        // withdraw atokens and send token to escrow beneficiary, as caller: contract
        _withdrawFromPool(
            _escrowTx.tokenAddr,
            _escrowTx.tokenAmount,
            _escrowTx.beneficiary
        );
        emit TransactionApproved(_escrowTxId);
    }

    // cancel an escrow tx id
    function cancelEscrowTransaction(
        uint _escrowTxId
    )
        public
        validateEscrowTx(_msgSender(), _escrowTxId, EscrowStatus.Created)
        whenNotPaused
    {
        // verify escrow tx
        EscrowTransaction storage _escrowTx = escrowTxsMap[_escrowTxId];
        // mark escrow tx as approved
        _escrowTx.status = EscrowStatus.Canceled;
        // withdraw funds back to escrow tx initiator
        _withdrawFromPool(
            _escrowTx.tokenAddr,
            _escrowTx.tokenAmount,
            _escrowTx.initiator
        );
        emit TransactionCanceled(_escrowTxId);
    }

    // change an escrow tx to Dispute status
    function initiateDispute(
        uint _escrowTxId
    )
        external
        validateEscrowTx(_msgSender(), _escrowTxId, EscrowStatus.Created)
        whenNotPaused
    {
        // verify escrow tx
        EscrowTransaction storage _escrowTx = escrowTxsMap[_escrowTxId];
        // change tx status to Dispute
        _escrowTx.status = EscrowStatus.Dispute;
        emit TransactionDisputed(_escrowTxId);
    }

    // close dispute and approve escrow tx
    function closeDisputeAndApprove(
        uint _escrowTxId
    )
        external
        validateEscrowTx(_msgSender(), _escrowTxId, EscrowStatus.Dispute)
        whenNotPaused
    {
        // verify escrow tx
        EscrowTransaction storage _escrowTx = escrowTxsMap[_escrowTxId];
        // change status to Created
        _escrowTx.status = EscrowStatus.Created;
        // approve escrow tx id
        approveEscrowTransaction(_escrowTxId);
    }
    // close dispute and cancel escrow tx
    function closeDisputeAndCancel(
        uint _escrowTxId
    )
        external
        validateEscrowTx(_msgSender(), _escrowTxId, EscrowStatus.Dispute)
        whenNotPaused
    {
        cancelEscrowTransaction(_escrowTxId);
    }

    // withdraw atokens and send token to address(_to), as caller: contract
    function _withdrawFromPool(
        address _tokenAddr,
        uint256 _tokenAmount,
        address _to
    ) internal nonReentrant whenNotPaused {
        (bool successWithdraw, ) = address(POOL).call(
            abi.encodeWithSignature(
                "withdraw(address,uint256,address)",
                _tokenAddr,
                _tokenAmount,
                _to
            )
        );

        if (!successWithdraw)
            revert ErrorWithdrawFromPool(_tokenAddr, _tokenAmount, _to);
    }

    // transfer tokens from contract to given address
    function rescueTokens(
        address _tokenAddr,
        address _to,
        uint256 _amount
    ) external onlyOwner nonReentrant {
        IERC20 token = IERC20(_tokenAddr);
        token.transferFrom(address(this), _to, _amount);
    }

    // Returns the user account data across all the reserves
    function getUserAccountData(
        address _user
    )
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return POOL.getUserAccountData(_user);
    }

    receive() external payable {}

    // done: allow to create an escrow transaction with many users.
    // done: define statuses of escrow transaction.
    // done: use aave to  yield funds while in escrow transaction.
    // done: multiple tokens (list of supported tokens from aave).
    // done: custom rules, timelock withdrawals.
    // todo: maybe vesting wallet.
}
