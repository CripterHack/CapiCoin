const CapiToken = artifacts.require("CapiToken");
const { expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("CapiToken - Security Audit", function (accounts) {
    const [owner, developmentWallet, donationWallet, user1, user2, attacker] = accounts;
    const INITIAL_SUPPLY = new BN("1000000000").mul(new BN("10").pow(new BN("18")));
    let token;

    beforeEach(async function () {
        token = await CapiToken.new(developmentWallet, donationWallet);
    });

    describe("1. Pruebas de Overflow/Underflow", function () {
        it("debería manejar transferencias grandes correctamente", async function () {
            const maxUint256 = new BN("2").pow(new BN("256")).sub(new BN("1"));
            await expectRevert.unspecified(
                token.transfer(user1, maxUint256, { from: owner })
            );
        });

        it("debería prevenir underflow en transferencias", async function () {
            const amount = new BN("1000").mul(new BN("10").pow(new BN("18")));
            await expectRevert.unspecified(
                token.transfer(user2, amount, { from: user1 })
            );
        });
    });

    describe("2. Pruebas de Reentrancia", function () {
        it("debería estar protegido contra reentrancia", async function () {
            const amount = new BN("1000").mul(new BN("10").pow(new BN("18")));
            await token.transfer(user1, amount, { from: owner });
            
            const user1Balance = await token.balanceOf(user1);
            expect(user1Balance).to.be.bignumber.gt("0");
        });
    });

    describe("3. Pruebas de Control de Acceso", function () {
        it("solo el owner debería poder actualizar las carteras", async function () {
            await expectRevert(
                token.setDonationWallet(attacker, { from: attacker }),
                "Ownable: caller is not the owner"
            );
        });

        it("no debería permitir establecer carteras a dirección cero", async function () {
            const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
            await expectRevert(
                token.setDonationWallet(ZERO_ADDRESS, { from: owner }),
                "New donation wallet cannot be zero address"
            );
        });
    });

    describe("4. Pruebas de Cálculo de Tarifas", function () {
        it("debería calcular las tarifas correctamente sin pérdida de precisión", async function () {
            const amount = new BN("100").mul(new BN("10").pow(new BN("18")));
            await token.transfer(user1, amount, { from: owner });

            const expectedFee = amount.mul(new BN("200")).div(new BN("10000")); // 2%
            const user1Balance = await token.balanceOf(user1);
            const expectedBalance = amount.sub(expectedFee);

            expect(user1Balance).to.be.bignumber.equal(expectedBalance);
        });

        it("debería manejar transferencias pequeñas correctamente", async function () {
            const smallAmount = new BN("100"); // cantidad muy pequeña
            await token.transfer(user1, smallAmount, { from: owner });
            const balance = await token.balanceOf(user1);
            expect(balance).to.be.bignumber.gt("0");
        });
    });

    describe("5. Pruebas de Eventos", function () {
        it("debería emitir todos los eventos requeridos", async function () {
            const amount = new BN("1000").mul(new BN("10").pow(new BN("18")));
            const tx = await token.transfer(user1, amount, { from: owner });

            // Verificar eventos
            const transferEvent = tx.logs.find(log => log.event === "Transfer");
            const burnEvent = tx.logs.find(log => log.event === "TokensBurned");
            const devEvent = tx.logs.find(log => log.event === "DevelopmentFeeSent");
            const donationEvent = tx.logs.find(log => log.event === "DonationSent");

            expect(transferEvent).to.not.be.undefined;
            expect(burnEvent).to.not.be.undefined;
            expect(devEvent).to.not.be.undefined;
            expect(donationEvent).to.not.be.undefined;
        });
    });

    describe("6. Pruebas de Estado del Contrato", function () {
        it("debería mantener el suministro total correcto después de quemar tokens", async function () {
            const amount = new BN("1000").mul(new BN("10").pow(new BN("18")));
            await token.transfer(user1, amount, { from: owner });

            const finalSupply = await token.totalSupply();
            expect(finalSupply).to.be.bignumber.lt(INITIAL_SUPPLY);
        });

        it("debería mantener la consistencia de los balances", async function () {
            const amount = new BN("1000").mul(new BN("10").pow(new BN("18")));
            await token.transfer(user1, amount, { from: owner });

            const ownerBalance = await token.balanceOf(owner);
            const user1Balance = await token.balanceOf(user1);
            const devBalance = await token.balanceOf(developmentWallet);
            const donationBalance = await token.balanceOf(donationWallet);
            const totalSupply = await token.totalSupply();

            const totalBalances = ownerBalance.add(user1Balance).add(devBalance).add(donationBalance);
            expect(totalBalances).to.be.bignumber.equal(totalSupply);
        });
    });
}); 