const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying SakshiChain contracts...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy SakshiCoin (ERC20)
  console.log("📦 Deploying SakshiCoin...");
  const SakshiCoin = await hre.ethers.getContractFactory("SakshiCoin");
  const sakshiCoin = await SakshiCoin.deploy();
  await sakshiCoin.waitForDeployment();
  const sakCoinAddress = await sakshiCoin.getAddress();
  console.log("✅ SakshiCoin deployed to:", sakCoinAddress);

  // Deploy DigitalProductPassport (ERC721)
  console.log("\n📦 Deploying DigitalProductPassport...");
  const DigitalProductPassport = await hre.ethers.getContractFactory("DigitalProductPassport");
  const dpp = await DigitalProductPassport.deploy();
  await dpp.waitForDeployment();
  const dppAddress = await dpp.getAddress();
  console.log("✅ DigitalProductPassport deployed to:", dppAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SakshiCoin: {
        address: sakCoinAddress,
        name: "SakshiCoin",
        symbol: "SAK"
      },
      DigitalProductPassport: {
        address: dppAddress,
        name: "Sakshi Digital Product Passport",
        symbol: "SDPP"
      }
    }
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${hre.network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to:", deploymentFile);

  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("SakshiCoin (SAK):", sakCoinAddress);
  console.log("DigitalProductPassport (SDPP):", dppAddress);
  console.log("\nNetwork:", hre.network.name);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("\n" + "=".repeat(60));

  // Verify on Etherscan/Polygonscan if not on localhost
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log("\n🔍 Verifying contracts on block explorer...");
    
    try {
      await hre.run("verify:verify", {
        address: sakCoinAddress,
        constructorArguments: [],
      });
      console.log("✅ SakshiCoin verified");
    } catch (error) {
      console.log("❌ SakshiCoin verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: dppAddress,
        constructorArguments: [],
      });
      console.log("✅ DigitalProductPassport verified");
    } catch (error) {
      console.log("❌ DigitalProductPassport verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
