// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "./EscrowVariables.sol";

/// @title An escrow contract for personal business transactions.
/// @author thecil - Carlos Zambrano
/// @notice Provide a secure mechanism for me to secure an asset funds transaction with custom rules that fit a business agreement with third parties.
/// @dev Explain to a developer any extra details
contract Escrow is EscrowVariables, Ownable, Pausable, ReentrancyGuard {
    constructor() Ownable(_msgSender()) {}

    // todo: allow to create an escrow transaction with many users.

    // create a new escrow tx using a token
    function createEscrowTransactionWithToken(
        address _beneficiary,
        address _tokenAddr,
        uint256 _tokenAmount
    ) external {
        // verify token is supported
        if (supportedTokensMap[_tokenAddr] == false)
            revert TokenNotSupported(_tokenAddr);
        uint _escrowActiveTxId = activeUserBeneficiaryEscrowTxMap[_msgSender()][
            _beneficiary
        ];
        EscrowTransaction memory _escrowTransaction = escrowTxsMap[
            _escrowActiveTxId
        ];
        // verify if beneficiary and msg.sender have an active transaction.
        if (
            _escrowTransaction.beneficiary == _beneficiary &&
            _escrowTransaction.initiator == _msgSender()
        ) {
            // escrow tx is on status created or approved, must be completed to in order to create a new one
            if (
                _escrowTransaction.status == EscrowStatus.Created ||
                _escrowTransaction.status == EscrowStatus.Approved
            )
                revert ActiveEscrowTx(
                    _escrowActiveTxId,
                    _msgSender(),
                    _beneficiary
                );
        }
        // increase tx counter to get a new number for this tx as id
        counterEscrowTransactions++;
        IERC20 token = IERC20(_tokenAddr);
        // transfer funds
        token.transferFrom(_msgSender(), address(this), _tokenAmount);

        // add tx id to users map
        userEscrowsMap[_msgSender()].push(counterEscrowTransactions);
        // create tx
        EscrowTransaction memory newEscrowTransaction = EscrowTransaction(
            payable(_beneficiary),
            _msgSender(),
            _tokenAddr,
            _tokenAmount,
            EscrowStatus.Created
        );
        // add tx to escrows map
        escrowTxsMap[counterEscrowTransactions] = newEscrowTransaction;
        emit TransactionCreated(
            _beneficiary,
            _msgSender(),
            _tokenAddr,
            _tokenAmount
        );
    }

    // create a new escrow tx using ether
    function createEscrowTransactionWithEther(
        address _beneficiary
    ) external payable {
        uint _escrowActiveTxId = activeUserBeneficiaryEscrowTxMap[_msgSender()][
            _beneficiary
        ];
        EscrowTransaction memory _escrowTransaction = escrowTxsMap[
            _escrowActiveTxId
        ];
        // verify if beneficiary and msg.sender have an active transaction.
        if (
            _escrowTransaction.beneficiary == _beneficiary &&
            _escrowTransaction.initiator == _msgSender()
        ) {
            // escrow tx is on status created or approved, must be completed to in order to create a new one
            if (
                _escrowTransaction.status == EscrowStatus.Created ||
                _escrowTransaction.status == EscrowStatus.Approved
            )
                revert ActiveEscrowTx(
                    _escrowActiveTxId,
                    _msgSender(),
                    _beneficiary
                );
        }
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
            address(0),
            msg.value,
            EscrowStatus.Created
        );
        // add tx to escrows map
        escrowTxsMap[counterEscrowTransactions] = newEscrowTransaction;
        emit TransactionCreated(
            _beneficiary,
            _msgSender(),
            address(0),
            msg.value
        );
    }

    // done: define statuses of escrow transaction.
    // todo: define arbiter type. (not sure where it will fit yet).
    // todo: use aave to  yield funds while in escrow transaction.
    // todo: multiple tokens (list of supported tokens).
    // todo: custom rules, allowing to withdraw initially a % of the funds.
    // todo: custom rules, timelock withdrawals.
    // todo: custom rules, "commitment fee" (request the beneficiary of the funds to deposit a commitment fee, if they failed the rules of the business agreement, they lost the fee as penalty, this way they will not waste my time nor my txs fee for creating an escrow tx).
    // todo: maybe vesting wallet.
}
