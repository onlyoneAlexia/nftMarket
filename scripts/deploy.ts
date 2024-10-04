import { ethers,run } from "hardhat";


async function deploy() {

    const NFTMarketplaceTokenAddress = await ethers.getContractFactory('NFTMarketplace');
    const nftMarket = await NFTMarketplaceTokenAddress.deploy();
 await  nftMarket.waitForDeployment()


   console.log('NFTMarketplace Contract deployed to',nftMarket.target)

   await run("verify:verify", {
    address: nftMarket.target,
    constructorArguments: [],
  });
   



    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

