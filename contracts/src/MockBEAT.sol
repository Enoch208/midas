// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockBEAT is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 1e18;

    constructor() ERC20("BEAT", "BEAT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
