# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
# NFT Marketplace Contract
=====================================

## Overview

This contract is a decentralized NFT marketplace built on the Ethereum blockchain. It allows users to list their NFTs for sale, purchase NFTs from other users, and cancel their own listings.

## Technical Details

### Contracts

The main contract is the [NFTMarketplace](https://github.com/your-repo/contracts/NFTMarketplace.sol) contract, which is responsible for managing the listings and purchases of NFTs. It uses the [OpenZeppelin ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) contract for NFT functionality.

### Functions

The contract has the following functions:

* [listNFT](https://github.com/your-repo/contracts/NFTMarketplace.sol#L34): Lists an NFT for sale
* [buyNFT](https://github.com/your-repo/contracts/NFTMarketplace.sol#L54): Purchases an NFT from another user
* [cancelOrder](https://github.com/your-repo/contracts/NFTMarketplace.sol#L74): Cancels a listing

### Events

The contract emits the following events:

* [NFTListed](https://github.com/your-repo/contracts/NFTMarketplace.sol#L24): Emitted when an NFT is listed for sale
* [NFTSold](https://github.com/your-repo/contracts/NFTMarketplace.sol#L44): Emitted when an NFT is purchased
* [OrderCanceled](https://github.com/your-repo/contracts/NFTMarketplace.sol#L64): Emitted when a listing is canceled

## Testing

The contract has a comprehensive test suite, which can be found in the [test](https://github.com/your-repo/test) directory.

## Deployment

To deploy the contract, follow these steps:

1. Install the dependencies using `npm install`
2. Compile the contract using `npx hardhat compile`
3. Deploy the contract using `npx hardhat deploy`

## Contributing

If you'd like to contribute to the project, feel free to submit a pull request. We're always open to new ideas and improvements.
