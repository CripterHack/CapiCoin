const CapiToken = artifacts.require("CapiToken");

module.exports = async function (deployer, network, accounts) {
  // Development wallet will be the first account
  const developmentWallet = accounts[0];
  
  // Donation wallet will be the second account for development
  // In production, this should be replaced with the actual donation wallet address
  const donationWallet = accounts[1];

  await deployer.deploy(CapiToken, developmentWallet, donationWallet);
  const capiToken = await CapiToken.deployed();
  
  console.log("CapiToken deployed at:", capiToken.address);
  console.log("Development wallet:", developmentWallet);
  console.log("Donation wallet:", donationWallet);
}; 