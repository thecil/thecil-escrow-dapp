import {
  mine,
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import {
  parseEther,
  getAddress,
  getContract,
  formatEther,
  parseUnits,
  erc20Abi,
} from "viem";
import { unixNow, timeToUnix, timeout } from "./unix-time";
import { faucetAbi } from "./abi/faucetAbi";
import { WalletBalanceProviderAbi } from "./abi/walletBalanceProviderAbi";
import { testnetErc20Abi } from "./abi/testnetErc20Abi";
import {
  sepoliaAaveContracts,
  sepoliaAaveReserveTokens,
  sepoliaAaveAtokens
} from "./aaveContracts";

describe("Escrow", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployEscrowFixture() {
    const publicClient = await hre.viem.getPublicClient();
    // Contracts are deployed using the first signer/account by default
    const [owner, acc1, acc2] = await hre.viem.getWalletClients();

    const escrowContract = await hre.viem.deployContract("EscrowYieldTestnet", [
      sepoliaAaveContracts.poolAddressesProviderAave,
    ]);

    const walletBalanceProviderContract = getContract({
      address: sepoliaAaveContracts.walletBalanceProvider,
      abi: WalletBalanceProviderAbi,
      client: publicClient,
    });

    const faucet = getContract({
      address: sepoliaAaveContracts.faucet,
      abi: faucetAbi,
      client: publicClient,
    });

    const testnetTokens = {
      dai: getContract({
        address: sepoliaAaveReserveTokens.dai,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      link: getContract({
        address: sepoliaAaveReserveTokens.link,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      usdc: getContract({
        address: sepoliaAaveReserveTokens.usdc,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      wbtc: getContract({
        address: sepoliaAaveReserveTokens.wbtc,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      weth: getContract({
        address: sepoliaAaveReserveTokens.weth,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      usdt: getContract({
        address: sepoliaAaveReserveTokens.usdt,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
      aave: getContract({
        address: sepoliaAaveReserveTokens.aave,
        abi: testnetErc20Abi,
        client: publicClient,
      }),
    };

    

    const aTokensAave = {
      dai: getContract({
        address: sepoliaAaveAtokens.dai,
        abi: erc20Abi,
        client: publicClient,
      }),
      link: getContract({
        address: sepoliaAaveAtokens.link,
        abi: erc20Abi,
        client: publicClient,
      }),
      usdc: getContract({
        address: sepoliaAaveAtokens.usdc,
        abi: erc20Abi,
        client: publicClient,
      }),
      wbtc: getContract({
        address: sepoliaAaveAtokens.wbtc,
        abi: erc20Abi,
        client: publicClient,
      }),
      weth: getContract({
        address: sepoliaAaveAtokens.weth,
        abi: erc20Abi,
        client: publicClient,
      }),
      usdt: getContract({
        address: sepoliaAaveAtokens.usdt,
        abi: erc20Abi,
        client: publicClient,
      }),
      aave: getContract({
        address: sepoliaAaveAtokens.aave,
        abi: erc20Abi,
        client: publicClient,
      }),
    };

    console.log("contracts", {
      escrow: escrowContract.address,
      pool: await escrowContract.read.POOL(),
    });

    return {
      // contracts
      escrowContract,
      walletBalanceProviderContract,
      faucet,
      testnetTokens,
      aTokensAave,
      // utils
      owner,
      acc1,
      acc2,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("ESCROW: Should set the deployer as owner", async function () {
      const { escrowContract, owner } = await loadFixture(deployEscrowFixture);
      expect(await escrowContract.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });

    it("ESCROW: Should set the aave pool address", async function () {
      const { escrowContract } = await loadFixture(deployEscrowFixture);

      expect(await escrowContract.read.POOL()).to.equal(
        sepoliaAaveContracts.poolAddress
      );
    });
  });

  describe("Creating Escrow Transaction", function () {
    it("Should create an escrow tx", async function () {
      const {
        escrowContract,
        faucet,
        testnetTokens,
        owner,
        acc1,
        publicClient,
      } = await loadFixture(deployEscrowFixture);
      // 1 minute time lock
      const _timeLock = unixNow() + timeToUnix(1, "minutes");

      // mint if balance below 100 tokens
      const _balanceOfTestnetToken = await testnetTokens.dai.read.balanceOf([
        owner.account.address,
      ]);
      if (_balanceOfTestnetToken < 100n) {
        await faucet.write.mint(
          [
            sepoliaAaveReserveTokens.dai,
            owner.account.address,
            parseEther("1000"),
          ],
          { account: owner.account.address }
        );
      }
      // approve contract to spent tokens
      await testnetTokens.dai.write.approve(
        [escrowContract.address, parseEther("1000")],
        { account: owner.account.address }
      );

      // create new escrow tx
      const hash = await escrowContract.write.createEscrowTransaction([
        acc1.account.address,
        sepoliaAaveReserveTokens.dai,
        parseEther("100"),
        BigInt(_timeLock),
      ]);
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
      expect(transactionCreatedEvent[0].args.tokenAddr).to.equal(
        getAddress(sepoliaAaveReserveTokens.dai)
      );
      expect(transactionCreatedEvent[0].args.tokenAmount).to.equal(
        parseEther("100")
      );
      expect(transactionCreatedEvent[0].args.unlockTime).to.equal(
        BigInt(_timeLock)
      );

      // verify mappings
      expect(
        await escrowContract.read.getActiveEscrowTransaction([
          owner.account.address,
          acc1.account.address,
        ])
      ).to.equal(1n);
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
      expect(escrowTxsMap.tokenAddr).to.equal(sepoliaAaveReserveTokens.dai);
      expect(escrowTxsMap.tokenAmount).to.equal(parseEther("100"));

      // should not allow to create a new escrow tx with same users while there is another escrow tx active
      await expect(
        escrowContract.write.createEscrowTransaction([
          acc1.account.address,
          sepoliaAaveReserveTokens.dai,
          parseEther("100"),
          BigInt(_timeLock),
        ])
      ).to.be.rejectedWith();
    });

    it("Should create and approve after timelock", async function () {
      const {
        escrowContract,
        owner,
        acc1,
        publicClient,
        testnetTokens,
        faucet,
        walletBalanceProviderContract,
        aTokensAave
      } = await loadFixture(deployEscrowFixture);

      // 1 second time lock
      const _timeLock = unixNow() + timeToUnix(1, "seconds");
      // mint if balance below 100 tokens
      const _balanceOfTestnetToken = await testnetTokens.dai.read.balanceOf([
        owner.account.address,
      ]);
      if (_balanceOfTestnetToken < 100n) {
        await faucet.write.mint(
          [
            sepoliaAaveReserveTokens.dai,
            owner.account.address,
            parseEther("1000"),
          ],
          { account: owner.account.address }
        );
      }
      // approve contract to spent tokens
      await testnetTokens.dai.write.approve(
        [escrowContract.address, parseEther("1000")],
        { account: owner.account.address }
      );
      await escrowContract.write.createEscrowTransaction([
        acc1.account.address,
        sepoliaAaveReserveTokens.dai,
        parseEther("100"),
        BigInt(_timeLock),
      ]);

      await mine(10, { interval: 1000 });

      // balance before approval
      const _balanceAcc1Before = await testnetTokens.dai.read.balanceOf(
        [acc1.account.address],
        { account: acc1.account.address }
      );

      const _activeTxId = await escrowContract.read.getActiveEscrowTransaction([
        owner.account.address,
        acc1.account.address,
      ]);

      const hash = await escrowContract.write.approveEscrowTransaction([
        _activeTxId,
      ]);
      await publicClient.waitForTransactionReceipt({ hash });

      // emit event
      const transactionApprovedEvent =
        await escrowContract.getEvents.TransactionApproved();
      expect(transactionApprovedEvent).to.have.lengthOf(1);
      expect(transactionApprovedEvent[0].args.id).to.equal(_activeTxId);

      // verify status of id
      const _escrowTx = escrowContract.read.getEscrowTransaction([_activeTxId]);
      expect((await _escrowTx).status).to.equal(1);

      // verify contract balance
      expect(await escrowContract.read.getContractEtherBalance()).to.equal(0n);
      // balance after approval
      const _balanceAcc1After = await testnetTokens.dai.read.balanceOf(
        [acc1.account.address],
        { account: acc1.account.address }
      );

      expect(_balanceAcc1Before + parseEther("100")).to.equal(
        _balanceAcc1After
      );

      // should fail because tx has been approved
      // await expect(
      //   escrowContract.write.approveEscrowTransaction([_activeTxId])
      // ).to.be.rejectedWith();
    });
  });
});
