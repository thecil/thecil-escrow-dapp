import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther, getAddress } from "viem";
describe("Escrow", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployEscrowFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, acc1, acc2] = await hre.viem.getWalletClients();

    const escrowContract = await hre.viem.deployContract("Escrow");
    const tokenContract = await hre.viem.deployContract("Token");

    const publicClient = await hre.viem.getPublicClient();

    return {
      escrowContract,
      tokenContract,
      owner,
      acc1,
      acc2,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the deployer as owner", async function () {
      const { escrowContract, owner } = await loadFixture(deployEscrowFixture);
      expect(await escrowContract.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });

    it("Should Mint tokens to accounts", async function () {
      const { tokenContract, acc1, acc2 } = await loadFixture(
        deployEscrowFixture
      );

      // connect acc1 to contract
      const tokenContractAsAcc1 = await hre.viem.getContractAt(
        "Token",
        tokenContract.address,
        { client: { wallet: acc1 } }
      );

      await tokenContractAsAcc1.write.mint();

      expect(
        await tokenContractAsAcc1.read.balanceOf([acc1.account.address])
      ).to.equal(parseEther("100"));

      // connect acc2 to contract
      const tokenContractAsAcc2 = await hre.viem.getContractAt(
        "Token",
        tokenContract.address,
        { client: { wallet: acc2 } }
      );

      await tokenContractAsAcc2.write.mint();

      expect(
        await tokenContractAsAcc2.read.balanceOf([acc2.account.address])
      ).to.equal(parseEther("100"));
    });
  });

  describe("Creating Escrow Transaction", function () {
    it("Should create an escrow tx using ether", async function () {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      const { escrowContract, owner, acc1, publicClient } = await loadFixture(
        deployEscrowFixture
      );

      const hash = await escrowContract.write.createEscrowTransactionWithEther(
        [acc1.account.address],
        { value: parseEther("1") }
      );
      await publicClient.waitForTransactionReceipt({ hash });

      // emit event
      const transactionCreatedEvent =
        await escrowContract.getEvents.TransactionCreated();
      expect(transactionCreatedEvent).to.have.lengthOf(1);
      expect(transactionCreatedEvent[0].args.beneficiary).to.equal(
        getAddress(acc1.account.address)
      );
      expect(transactionCreatedEvent[0].args.initiator).to.equal(
        getAddress(owner.account.address)
      );
      expect(transactionCreatedEvent[0].args.tokenAddr).to.equal(zeroAddress);
      expect(transactionCreatedEvent[0].args.tokenAmount).to.equal(
        parseEther("1")
      );

      // verify mappings
      const userEscrowsMap = await escrowContract.read.getUserEscrows([
        owner.account.address,
      ]);
      expect(userEscrowsMap).to.have.lengthOf(1);
      expect(userEscrowsMap[0]).to.equal(1n);
      const escrowTxsMap = await escrowContract.read.getEscrowTransaction([1n]);
      expect(escrowTxsMap.beneficiary).to.equal(
        getAddress(acc1.account.address)
      );
      expect(escrowTxsMap.initiator).to.equal(
        getAddress(owner.account.address)
      );
      expect(escrowTxsMap.status).to.equal(0);
      expect(escrowTxsMap.tokenAddr).to.equal(zeroAddress);
      expect(escrowTxsMap.tokenAmount).to.equal(parseEther("1"));
      // verify contract balance
      expect(await escrowContract.read.getContractEtherBalance()).to.equal(
        parseEther("1")
      );
      // should not allow to create a new escrow tx with same users while there is another escrow tx active
      await expect(
        escrowContract.write.createEscrowTransactionWithEther(
          [acc1.account.address],
          { value: parseEther("1") }
        )
      ).to.be.rejectedWith();
    });
  });
});
