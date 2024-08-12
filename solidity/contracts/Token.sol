// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("TEST TOKEN", "TEST") {}

    function mint() public {
        _mint(msg.sender, 100 ether);
    }
}
