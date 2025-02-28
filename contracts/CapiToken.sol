// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CapiToken
 * @dev Implementation of the CapiToken
 */
contract CapiToken is ERC20, Ownable, ReentrancyGuard {
    // Token constants
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Fee percentages (in basis points, 1 basis point = 0.01%)
    uint256 public constant TOTAL_FEE = 200; // 2%
    uint256 public constant BURN_FEE = 50;   // 0.5%
    uint256 public constant DEV_FEE = 50;    // 0.5%
    uint256 public constant DONATION_FEE = 100; // 1%

    // Fee collection addresses
    address public developmentWallet;
    address public donationWallet;

    // Events
    event DonationAddressUpdated(address indexed previousAddress, address indexed newAddress);
    event DevelopmentAddressUpdated(address indexed previousAddress, address indexed newAddress);
    event TokensBurned(uint256 amount);
    event DonationSent(address indexed to, uint256 amount);
    event DevelopmentFeeSent(address indexed to, uint256 amount);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     * @param _developmentWallet Address where development fees will be sent
     * @param _donationWallet Address where donation fees will be sent
     */
    constructor(
        address _developmentWallet,
        address _donationWallet
    ) ERC20("Capibara", "CAPI") {
        require(_developmentWallet != address(0), "Development wallet cannot be zero address");
        require(_donationWallet != address(0), "Donation wallet cannot be zero address");
        
        developmentWallet = _developmentWallet;
        donationWallet = _donationWallet;
        
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Override transfer function to include fee processing
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override nonReentrant {
        require(sender != address(0), "Transfer from zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        // Calculate fees
        uint256 totalFeeAmount = (amount * TOTAL_FEE) / 10000;
        uint256 burnAmount = (amount * BURN_FEE) / 10000;
        uint256 devAmount = (amount * DEV_FEE) / 10000;
        uint256 donationAmount = (amount * DONATION_FEE) / 10000;
        uint256 transferAmount = amount - totalFeeAmount;

        // Process the main transfer
        if (recipient != address(0)) {
            super._transfer(sender, recipient, transferAmount);
        } else {
            // If recipient is zero address, add to burn amount
            burnAmount += transferAmount;
        }

        // Process burn
        if (burnAmount > 0) {
            _burn(sender, burnAmount);
            emit TokensBurned(burnAmount);
        }

        // Process development fee
        if (devAmount > 0) {
            super._transfer(sender, developmentWallet, devAmount);
            emit DevelopmentFeeSent(developmentWallet, devAmount);
        }

        // Process donation
        if (donationAmount > 0) {
            super._transfer(sender, donationWallet, donationAmount);
            emit DonationSent(donationWallet, donationAmount);
        }
    }

    /**
     * @dev Update the donation wallet address
     * @param newDonationWallet New address for the donation wallet
     */
    function setDonationWallet(address newDonationWallet) external onlyOwner {
        require(newDonationWallet != address(0), "New donation wallet cannot be zero address");
        emit DonationAddressUpdated(donationWallet, newDonationWallet);
        donationWallet = newDonationWallet;
    }

    /**
     * @dev Update the development wallet address
     * @param newDevelopmentWallet New address for the development wallet
     */
    function setDevelopmentWallet(address newDevelopmentWallet) external onlyOwner {
        require(newDevelopmentWallet != address(0), "New development wallet cannot be zero address");
        emit DevelopmentAddressUpdated(developmentWallet, newDevelopmentWallet);
        developmentWallet = newDevelopmentWallet;
    }
} 