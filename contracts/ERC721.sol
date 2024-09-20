// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestERC721 is ERC721, Ownable(msg.sender) {
    uint256 public nextTokenId;

    constructor() ERC721("TestNFT", "TNFT") {}

    function mint(address to) external onlyOwner {
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://api.example.com/metadata/"; // Base URI for metadata
    }
}