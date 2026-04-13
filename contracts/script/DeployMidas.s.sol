// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockBEAT} from "../src/MockBEAT.sol";
import {MidasSplitter} from "../src/MidasSplitter.sol";

contract DeployMidas is Script {
    function run() external returns (MockBEAT beat, MidasSplitter splitter) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        beat = new MockBEAT();
        splitter = new MidasSplitter(address(beat));

        vm.stopBroadcast();

        console.log("MockBEAT deployed at:      ", address(beat));
        console.log("MidasSplitter deployed at: ", address(splitter));
    }
}
