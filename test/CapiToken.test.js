const CapiToken = artifacts.require("CapiToken");
const { expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("CapiToken", function (accounts) {
    const [owner, developmentWallet, donationWallet, user1, user2] = accounts;
    const INITIAL_SUPPLY = new BN("1000000000").mul(new BN("10").pow(new BN("18"))); // 1 billion tokens
    
    // Fee constants in basis points (1 basis point = 0.01%)
    const TOTAL_FEE = new BN("200");     // 2%
    const BURN_FEE = new BN("50");       // 0.5%
    const DEV_FEE = new BN("50");        // 0.5%
    const DONATION_FEE = new BN("100");   // 1%

    let token;

    beforeEach(async function () {
        // Deploy a new token before each test
        token = await CapiToken.new(developmentWallet, donationWallet);
    });

    describe("Inicialización", function () {
        it("debería tener el nombre correcto", async function () {
            expect(await token.name()).to.equal("Capibara");
        });

        it("debería tener el símbolo correcto", async function () {
            expect(await token.symbol()).to.equal("CAPI");
        });

        it("debería tener 18 decimales", async function () {
            const decimals = await token.decimals();
            expect(decimals.toString()).to.equal("18");
        });

        it("debería asignar el suministro total inicial al creador", async function () {
            const ownerBalance = await token.balanceOf(owner);
            expect(ownerBalance.toString()).to.equal(INITIAL_SUPPLY.toString());
        });

        it("debería configurar correctamente las carteras de desarrollo y donación", async function () {
            expect(await token.developmentWallet()).to.equal(developmentWallet);
            expect(await token.donationWallet()).to.equal(donationWallet);
        });
    });

    describe("Transferencias y Tarifas", function () {
        const transferAmount = new BN("1000").mul(new BN("10").pow(new BN("18"))); // 1000 tokens

        beforeEach(async function () {
            // Transfer some tokens to user1 for testing
            await token.transfer(user1, transferAmount.mul(new BN("2")), { from: owner });
        });

        it("debería calcular correctamente las tarifas en una transferencia", async function () {
            const totalFee = transferAmount.mul(TOTAL_FEE).div(new BN("10000"));
            const burnFee = transferAmount.mul(BURN_FEE).div(new BN("10000"));
            const devFee = transferAmount.mul(DEV_FEE).div(new BN("10000"));
            const donationFee = transferAmount.mul(DONATION_FEE).div(new BN("10000"));
            const expectedTransferAmount = transferAmount.sub(totalFee);

            // Get initial balances
            const initialUser2Balance = await token.balanceOf(user2);
            const initialDevBalance = await token.balanceOf(developmentWallet);
            const initialDonationBalance = await token.balanceOf(donationWallet);

            // Realizar transferencia
            await token.transfer(user2, transferAmount, { from: user1 });

            // Get final balances
            const finalUser2Balance = await token.balanceOf(user2);
            const finalDevBalance = await token.balanceOf(developmentWallet);
            const finalDonationBalance = await token.balanceOf(donationWallet);

            // Calculate actual changes
            const actualUser2Change = finalUser2Balance.sub(initialUser2Balance);
            const actualDevChange = finalDevBalance.sub(initialDevBalance);
            const actualDonationChange = finalDonationBalance.sub(initialDonationBalance);

            // Verify changes
            expect(actualUser2Change.toString()).to.equal(expectedTransferAmount.toString());
            expect(actualDevChange.toString()).to.equal(devFee.toString());
            expect(actualDonationChange.toString()).to.equal(donationFee.toString());
        });

        it("debería emitir eventos correctamente durante la transferencia", async function () {
            const receipt = await token.transfer(user2, transferAmount, { from: user1 });

            expectEvent(receipt, "Transfer", {
                from: user1,
                to: user2
            });

            expectEvent(receipt, "TokensBurned");
            expectEvent(receipt, "DevelopmentFeeSent");
            expectEvent(receipt, "DonationSent");
        });

        it("debería revertir si el balance es insuficiente", async function () {
            const tooMuch = INITIAL_SUPPLY.add(new BN("1"));
            await expectRevert(
                token.transfer(user2, tooMuch, { from: user1 }),
                "ERC20: transfer amount exceeds balance"
            );
        });
    });

    describe("Administración de Carteras", function () {
        it("debería permitir al owner actualizar la cartera de donaciones", async function () {
            const newDonationWallet = user2;
            const receipt = await token.setDonationWallet(newDonationWallet, { from: owner });

            expect(await token.donationWallet()).to.equal(newDonationWallet);
            expectEvent(receipt, "DonationAddressUpdated", {
                previousAddress: donationWallet,
                newAddress: newDonationWallet
            });
        });

        it("debería permitir al owner actualizar la cartera de desarrollo", async function () {
            const newDevelopmentWallet = user2;
            const receipt = await token.setDevelopmentWallet(newDevelopmentWallet, { from: owner });

            expect(await token.developmentWallet()).to.equal(newDevelopmentWallet);
            expectEvent(receipt, "DevelopmentAddressUpdated", {
                previousAddress: developmentWallet,
                newAddress: newDevelopmentWallet
            });
        });

        it("debería revertir si una dirección no-owner intenta actualizar las carteras", async function () {
            await expectRevert(
                token.setDonationWallet(user2, { from: user1 }),
                "Ownable: caller is not the owner"
            );

            await expectRevert(
                token.setDevelopmentWallet(user2, { from: user1 }),
                "Ownable: caller is not the owner"
            );
        });

        it("debería revertir si se intenta establecer la dirección cero", async function () {
            const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
            await expectRevert(
                token.setDonationWallet(ZERO_ADDRESS, { from: owner }),
                "New donation wallet cannot be zero address"
            );

            await expectRevert(
                token.setDevelopmentWallet(ZERO_ADDRESS, { from: owner }),
                "New development wallet cannot be zero address"
            );
        });
    });
}); 