// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IAToken} from "@aave/core-v3/contracts/interfaces/IAToken.sol";

/// @title An abstract contract that includes all variables of its parents.
/// @author thecil - Carlos Zambrano
/// @notice Variables enums, structs, events, mappings and their getters used by its parent contract (escrow contract)
/// @dev It store all variable declarations for better view of parent contract.
abstract contract EscrowVariables {
    /***********************************|
    |            Modifiers              |
    |__________________________________*/
    modifier validateEscrowTx(
        address _msgSender,
        uint _escrowTxId,
        EscrowStatus _status,
        bool checkParticipants
    ) {
        // verify escrow tx
        EscrowTransaction storage _escrowTx = escrowTxsMap[_escrowTxId];
        if (checkParticipants) {
            if (
                _msgSender != _escrowTx.initiator &&
                _msgSender != _escrowTx.beneficiary
            ) revert OnlyEscrowTxParticipantAllowed();
        } else {
            if (_msgSender != _escrowTx.initiator)
                revert OnlyEscrowTxInitiatorAllowed();
        }

        if (_escrowTx.status != _status)
            revert IncorrectEscrowTxStatus(_escrowTx.status);
        _;
    }
    /***********************************|
    |              Erros                |
    |__________________________________*/

    /// @dev Zero address not allowed
    error ZeroAddressNotAllowed();
    /// @dev Insufficient balance (minimum value)
    error InsufficientBalance(uint256);
    /// @dev Token not supported (token address)
    error TokenNotSupported(address);
    /// @dev Only escrow tx initiator allowed
    error OnlyEscrowTxInitiatorAllowed();
    /// @dev Only escrow tx participant allowed
    error OnlyEscrowTxParticipantAllowed();
    /// @dev Active escrow tx between users (escrow tx id, user, beneficiary)
    error AlreadyActiveEscrowTx(uint, address, address);
    /// @dev Incorrect escrow tx status (escrow tx id)
    error IncorrectEscrowTxStatus(EscrowStatus);
    /// @dev Unlock time not reached (unlock timestamp, actual timestamp)
    error UnlockTimeNotReached(uint, uint);
    /// @dev Error withdraw  from pool (tokenAddr, value, receiver)
    error ErrorWithdrawFromPool(address, uint256, address);

    /***********************************|
    |              Events               |
    |__________________________________*/

    /// @notice Event triggered when an escrow transaction is created
    /// @param beneficiary the address that will receive the funds (receiver)
    /// @param initiator the address that initiate the transaction (payer)
    /// @param tokenAddr the token address used for this transaction.
    /// @param tokenAmount the token amount deposited for this transaction.
    /// @param unlockTime unlock time for funds.
    event TransactionCreated(
        address indexed beneficiary,
        address indexed initiator,
        address tokenAddr,
        uint256 tokenAmount,
        uint unlockTime
    );

    /// @notice Event triggered when an escrow transaction is approved
    /// @param id escrow transaction id.
    event TransactionApproved(uint id);

    /// @notice Event triggered when an escrow transaction is disputed
    /// @param id escrow transaction id.
    event TransactionDisputed(uint id);

    /// @notice Event triggered when an escrow transaction is canceled
    /// @param id escrow transaction id.
    event TransactionCanceled(uint id);

    /***********************************|
    |          Structs & Enums          |
    |__________________________________*/
    /// @dev Escrow Transaction statuses
    enum EscrowStatus {
        Created,
        Approved,
        Canceled,
        Dispute
    }

    /// @dev Escrow Transaction struct
    /// @param beneficiary receiver of funds (seller).
    /// @param initiator creator of escrow tx (buyer).
    /// @param tokenAddr token address used on this escrow tx, if zero Address means Ether as asset
    /// @param tokenAmount deposit amount of the asset used on this escrow tx.
    /// @param unlockTime unlock time for funds.
    /// @param status escrow tx status.
    struct EscrowTransaction {
        address payable beneficiary;
        address initiator;
        address tokenAddr;
        uint256 tokenAmount;
        uint unlockTime;
        EscrowStatus status;
    }

    /***********************************|
    |            Variables              |
    |__________________________________*/

    mapping(address => uint[]) public userEscrowsMap; // map address => escrow id
    mapping(uint => EscrowTransaction) public escrowTxsMap; // map id to escrow tx
    mapping(address => mapping(address => uint))
        public activeUserBeneficiaryEscrowTxMap; // map user address => beneficiary address => active estrow id
    uint public counterEscrowTransactions; // increase each time a tx is created, also works to get the total amount of txs and

    /***********************************|
    |         Getter Functions          |
    |__________________________________*/

    /// @notice Get all escrows tx
    /// @dev return an array of EscrowTransactions looping through the escrowTxsMap mapping where the max length is counterEscrowTransactions.
    /// @return EscrowTransaction[] array of all escrows tx
    function getAllEscrowsTx()
        public
        view
        returns (EscrowTransaction[] memory)
    {
        uint256 numTxs = counterEscrowTransactions;
        EscrowTransaction[] memory escrowTxsArray = new EscrowTransaction[](
            numTxs
        );

        for (uint256 i = 0; i < numTxs; i++) {
            // incresae 1 to avoid index 0, since the first escrow tx created will be stored on index 1 and so on from that point.
            EscrowTransaction storage escrowTx = escrowTxsMap[i + 1];
            escrowTxsArray[i] = escrowTx;
        }

        return escrowTxsArray;
    }

    /// @notice Get the active escrow tx between 2 accounts
    /// @dev returns the activeUserBeneficiaryEscrowTxMap mapping.
    /// @return uint active escrow tx id
    function getActiveEscrowTransaction(
        address _accountOne,
        address _accountTwo
    ) external view returns (uint) {
        return activeUserBeneficiaryEscrowTxMap[_accountOne][_accountTwo];
    }

    /// @notice get the details of given escrow tx id
    /// @dev returns the escrowTxsMap mapping.
    /// @return EscrowTransaction details
    function getEscrowTransaction(
        uint _id
    ) external view returns (EscrowTransaction memory) {
        return escrowTxsMap[_id];
    }

    /// @notice get a list of the user escrow txs ids
    /// @dev returns the userEscrowsMap mapping.
    /// @return uint[] list of escrow tx ids
    function getUserEscrows(
        address _user
    ) external view returns (uint[] memory) {
        return userEscrowsMap[_user];
    }

    /// @notice Ether balance of the contract
    /// @dev returns the ether funds holded by the contract
    /// @return balance of ether in wei
    function getContractEtherBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Token balance of the contract
    /// @dev returns the token balance of contract for given token address
    /// @return balance of token in wei
    function getContractBalanceOf(
        address _tokenAddr
    ) external view returns (uint256) {
        IERC20 token = IERC20(_tokenAddr);
        return token.balanceOf(address(this));
    }

    /// @notice aave Atoken balance of the contract
    /// @dev returns the token balance of contract for given aave Atoken address
    /// @return balance of token in wei
    function getContractAtokenBalanceOf(
        address _tokenAddr
    ) external view returns (uint256) {
        IAToken token = IAToken(_tokenAddr);
        return token.balanceOf(address(this));
    }
}
