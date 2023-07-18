// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../lib/knowyourcat-sdk/src/interfaces/IAggregator.sol";
import "../lib/knowyourcat-sdk/src/constants/SourceId.sol";

contract Consumer {
    IAggregator aggregator;
    IERC721 category;

    constructor(
        IAggregator aggregator_,
        IERC721 category_
    ) {
        aggregator = aggregator_;
        category = category_;
    }

    function hasSourceIdSynced(address account_) external view returns (bool) {
        return aggregator.isSynced(SourceId.BAB, account_).payload > 0;
    }

    function hasCategory(address account_) external view returns (bool) {
        return category.balanceOf(account_) > 0;
    }
}
