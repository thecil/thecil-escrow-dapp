// SPDX-License-Identifier: MIT
pragma solidity "0.8.26";

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

    mapping(address => uint8[]) public userEscrowsMap; // track address => escrow id
    mapping(uint => EscrowTransaction) public escrowTxsMap; // track id to escrow tx

    address[] public supportedTokens; // a list of supported tokens

    /***********************************|
    |         Getter Functions          |
    |__________________________________*/

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
