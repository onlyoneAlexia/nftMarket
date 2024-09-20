// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace is Ownable(msg.sender) {
    struct Order {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Order) public orders;
    mapping(address => bool) public whitelistedNFTContracts; // Whitelist mapping
    uint256 public nextOrderId;

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed orderId, address indexed buyer, uint256 price);
    event OrderCanceled(uint256 indexed orderId);

    error NotOwner();
    error NotListed();
    error InsufficientFunds();
    error InvalidPrice();
    error NotWhitelisted();
    error OrderNotFound();

    function whitelistNFTContract(address nftContract) external onlyOwner {
        whitelistedNFTContracts[nftContract] = true; // Whitelist the NFT contract
    }

    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        if (!whitelistedNFTContracts[nftContract]) revert NotWhitelisted(); // Check if contract is whitelisted
        if (msg.sender != IERC721(nftContract).ownerOf(tokenId)) revert NotOwner();
        if (price <= 0) revert InvalidPrice();

        orders[nextOrderId] = Order(nftContract, tokenId, msg.sender, price, true);
        emit NFTListed(nftContract, tokenId, msg.sender, price);
        nextOrderId++;
    }

    function buyNFT(uint256 orderId) external payable {
        Order storage order = orders[orderId];
        if (!order.isListed) revert NotListed();
        if (msg.value < order.price) revert InsufficientFunds();

        // Effects: Mark the order as sold
        order.isListed = false;

        // Interactions: Transfer the NFT and Ether
        (bool success, ) = order.seller.call{value: order.price}(""); // Use call to transfer Ether
        require(success, "Transfer failed"); // Ensure the transfer was successful

        // Transfer the NFT
        IERC721(order.nftContract).safeTransferFrom(order.seller, msg.sender, order.tokenId);

        // Refund excess ether
        if (msg.value > order.price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - order.price}(""); // Refund excess Ether
            require(refundSuccess, "Refund failed"); // Ensure the refund was successful
        }

        emit NFTSold(orderId, msg.sender, order.price);
    }

    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        if (order.seller != msg.sender) revert NotOwner(); // Only the seller can cancel
        if (!order.isListed) revert NotListed(); // Ensure the order is listed

        order.isListed = false; // Mark as canceled
        emit OrderCanceled(orderId);
    }

    function viewOrder(uint256 orderId) external view returns (Order memory) {
        Order memory order = orders[orderId];
        if (order.seller == address(0)) revert OrderNotFound(); // Check if order exists
        return order; // Return the order details
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}(""); // Use call to transfer Ether
        require(success, "Withdraw failed"); // Ensure the withdraw was successful
    }
}