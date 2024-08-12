// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title An abstract contract that includes all variables of its parents.
/// @author thecil - Carlos Zambrano
/// @notice Variables enums, structs, events, mappings and their getters used by its parent contract (escrow contract)
/// @dev It store all variable declarations for better view of parent contract.
abstract contract EscrowVariables {
    /***********************************|
    |              Erros                |
    |__________________________________*/

    /// @dev Zero address not allowed
    error ZeroAddressNotAllowed();
    /// @dev Insufficient balance (minimum amount)
    error InsufficientBalance(uint256);
    /// @dev Token not supported
    error TokenNotSupported(address);
    /// @dev Only escrow tx initiator allowed
    error onlyEscrowTxInitiatorAllowed();
    /// @dev Active escrow tx between users (escrow tx id, user, beneficiary)
    error ActiveEscrowTx(uint,address,address);
    /***********************************|
    |              Events               |
    |__________________________________*/

    /// @notice Event triggered when an escrow transaction is created
    /// @param beneficiary the address that will receive the funds (receiver)
    /// @param initiator the address that initiate the transaction (payer)
    /// @param tokenAddr the token address used for this transaction.
    /// @param tokenAmount the token amount deposited for this transaction.
    event TransactionCreated(
        address indexed beneficiary,
        address indexed initiator,
        address tokenAddr,
        uint256 tokenAmount
    );

    /// @notice Event triggered when an escrow transaction is approved
    /// @param id escrow transaction id.
    /// @param unlockTime unlock time for funds.
    event TransactionApproved(uint id, uint unlockTime);

    /***********************************|
    |          Structs & Enums          |
    |__________________________________*/
    /// @dev Escrow Transaction statuses
    enum EscrowStatus {
        Created,
        Approved,
        Completed,
        Canceled,
        Dispute
    }

    /// @dev Escrow Transaction struct
    struct EscrowTransaction {
        address payable beneficiary;
        address initiator;
        address tokenAddr;
        uint256 tokenAmount;
        EscrowStatus status;
    }

    /***********************************|
    |            Variables              |
    |__________________________________*/

    mapping(address => uint[]) public userEscrowsMap; // map address => escrow id
    mapping(uint => EscrowTransaction) public escrowTxsMap; // map id to escrow tx
    mapping(address => mapping(address => uint)) public activeUserBeneficiaryEscrowTxMap;
    mapping(address => bool) public supportedTokensMap; // map supported tokens

    address[] public supportedTokens; // a list of supported tokens
    uint public counterEscrowTransactions; // increase each time a tx is created, also works to get the total amount of txs and

    /***********************************|
    |         Getter Functions          |
    |__________________________________*/

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

    /// @notice get a list of supported tokens by the contract.
    /// @dev returns the supportedTokens array.
    /// @return address[] list of addresses
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /// @notice Ether balance of the contract
    /// @dev returns the ether funds holded by the contract
    /// @return balance of ether in wei
    function getContractEtherBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Token balance of contract
    /// @dev returns the token balance of contract for given token address
    /// @return balance of token in wei
    function getContractBalanceOf(
        address _tokenAddr
    ) external view returns (uint256) {
        IERC20 token = IERC20(_tokenAddr);
        return token.balanceOf(address(this));
    }
}
