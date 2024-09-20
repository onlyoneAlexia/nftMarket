import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTMarketplace, TestERC721 } from "../typechain-types";

describe("NFTMarketplace Contract", function () {
    let marketplace: NFTMarketplace;
    let testNFT: TestERC721;
    let addr1: any;
    let addr2: any;

    before(async function () {
        const NFT = await ethers.getContractFactory("TestERC721");
        testNFT = await NFT.deploy();
        await testNFT.waitForDeployment();

        const Marketplace = await ethers.getContractFactory("NFTMarketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.waitForDeployment();

        [addr1, addr2] = await ethers.getSigners();

        // Mint an NFT for addr1
        await testNFT.mint(addr1.address);
        await testNFT.mint(addr1.address); // Mint a second NFT for testing
        await testNFT.mint(addr1.address);
        await testNFT.mint(addr1.address);
        await testNFT.mint(addr1.address);
    });
    it("should revert if the NFT contract is not whitelisted", async function () {
        await expect(marketplace.connect(addr1).listNFT(testNFT.target, 0, ethers.parseUnits("1", 18))).to.be.revertedWithCustomError(marketplace,"NotWhitelisted");
    });

    it("should allow a user to list their NFT for sale", async function () {
        await testNFT.connect(addr1).approve(marketplace.target, 0); // Approve the marketplace to transfer the NFT
        await marketplace.whitelistNFTContract(testNFT.target); // Whitelist the NFT contract
        await marketplace.connect(addr1).listNFT(testNFT.target, 0, ethers.parseUnits("1", 18)); // List NFT with ID 0 for sale

        const order = await marketplace.viewOrder(0);
        expect(order.nftContract).to.equal(testNFT.target);
        expect(order.tokenId).to.equal(0);
        expect(order.seller).to.equal(addr1.address);
        expect(order.price).to.equal(ethers.parseUnits("1", 18));
        expect(order.isListed).to.be.true;
    });

    it("should allow a user to purchase a listed NFT", async function () {
        //await testNFT.connect(addr1).approve(marketplace.target, 0);
       //await marketplace.connect(addr1).listNFT(testNFT.target, 0, ethers.parseUnits("1", 18));

        await marketplace.connect(addr2).buyNFT(0, { value: ethers.parseUnits("1", 18) });

        const order = await marketplace.viewOrder(0);
        expect(order.isListed).to.be.false; // Order should be marked as sold
        expect(await testNFT.ownerOf(0)).to.equal(addr2.address); // NFT should be transferred to addr2
    });

    it("should not allow purchasing an NFT that is not listed", async function () {
        await expect(marketplace.connect(addr2).buyNFT(1)).to.be.revertedWithCustomError(marketplace,"NotListed");
    });

    it("should allow a user to cancel their order", async function () {
        await testNFT.connect(addr1).approve(marketplace.target, 2);
        await marketplace.connect(addr1).listNFT(testNFT.target, 2, ethers.parseUnits("1", 18));

        await marketplace.connect(addr1).cancelOrder(1);
        const order = await marketplace.viewOrder(1);
        expect(order.isListed).to.be.false; // Order should be marked as canceled
    });

    it("should not allow purchasing an inactive order", async function () {
        await testNFT.connect(addr1).approve(marketplace.target, 2);
        await marketplace.connect(addr1).listNFT(testNFT.target, 2, ethers.parseUnits("1", 18));

        await marketplace.connect(addr1).cancelOrder(2);
        await expect(marketplace.connect(addr2).buyNFT(2, { value: ethers.parseUnits("1", 18) })).to.be.revertedWithCustomError(marketplace,"NotListed");
    });

    it("should allow users to view orders", async function () {
     //   await testNFT.connect(addr1).approve(marketplace.target, 0);
        //await marketplace.connect(addr1).listNFT(testNFT.target, 0, ethers.parseUnits("1", 18));

        const order = await marketplace.viewOrder(2);
        expect(order.nftContract).to.equal(testNFT.target);
        expect(order.tokenId).to.equal(2);
        expect(order.seller).to.equal(addr1.address);
        expect(order.price).to.equal(ethers.parseUnits("1", 18));
        expect(order.isListed).to.be.false;
    });
});