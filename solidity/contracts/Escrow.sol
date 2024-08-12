// SPDX-License-Identifier: MIT
pragma solidity "0.8.26";

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
contract EscrowTC is EscrowVariables, Ownable, Pausable, ReentrancyGuard {

    constructor() Ownable(_msgSender()) {

    }
    // todo: allow to create an escrow transaction with many users.
    // todo: define statuses of escrow transaction.
    // todo: define arbiter type. (not sure where it will fit yet).
    // todo: use aave to  yield funds while in escrow transaction.
    // todo: multiple tokens (list of supported tokens).
    // todo: custom rules, allowing to withdraw initially a % of the funds.
    // todo: custom rules, timelock withdrawals.
    // todo: custom rules, "commitment fee" (request the beneficiary of the funds to deposit a commitment fee, if they failed the rules of the business agreement, they lost the fee as penalty, this way they will not waste my time nor my txs fee for creating an escrow tx).
    // todo: maybe vesting wallet.
}
