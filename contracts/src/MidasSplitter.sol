// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MidasSplitter is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable BEAT;

    event SplitExecuted(
        address indexed originalCreator,
        address indexed midasOwner,
        uint256 creatorAmount,
        uint256 ownerAmount,
        uint256 totalAmount
    );

    constructor(address beatToken) Ownable(msg.sender) {
        require(beatToken != address(0), "MidasSplitter: zero token");
        BEAT = IERC20(beatToken);
    }

    function executeFeatureSplit(address originalCreator, uint256 amount) external {
        require(originalCreator != address(0), "MidasSplitter: zero creator");
        require(amount > 0, "MidasSplitter: zero amount");

        uint256 creatorAmount = amount / 2;
        uint256 ownerAmount = amount - creatorAmount;

        BEAT.safeTransferFrom(msg.sender, originalCreator, creatorAmount);
        BEAT.safeTransferFrom(msg.sender, owner(), ownerAmount);

        emit SplitExecuted(originalCreator, owner(), creatorAmount, ownerAmount, amount);
    }
}
