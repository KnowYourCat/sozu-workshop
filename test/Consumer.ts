import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"
import axios from 'axios'

const AGGREGATOR_ADDRESS = "0xf78249b2D762C86C9699ff9BA74C5dbf9b4c168a"
const CATEGORY_ADDRESS = "0x0cE1f283ca59C4F7fE7581DDb94e08eBff17869E"

const ACCOUNT_ADDRESS = "0x71e9ab49addbc868b9fc3b02459cdf30d92775cd"

type Provider = {
  symbol: string
  sync: {
    byChainIds: {
      chainId: number
      timestamp: number
    }[]
  }
}

describe("Consumer", function () {
  async function prepare() {
    const Consumer = await ethers.getContractFactory("Consumer")
    const consumer = await Consumer.deploy(AGGREGATOR_ADDRESS, CATEGORY_ADDRESS)

    return { consumer }
  }

  describe("Deployment", function () {
    it("Should check if API is synced", async function () {
      const response = await axios.get(`https://api.knowyourcat.id/v1/${ACCOUNT_ADDRESS}`)

      const BABProvider = response.data.providers.find((provider: Provider) => provider.symbol === 'BABT') as Provider
      const mantleSync = BABProvider.sync.byChainIds.find(sync => sync.chainId === 5001)

      expect(mantleSync!.timestamp > 0).to.equal(true)
    });
    it("Should check if sourceId is synced", async function () {
      const { consumer } = await loadFixture(prepare)

      const hasSourceIdSynced = await consumer.hasSourceIdSynced(ACCOUNT_ADDRESS)

      expect(hasSourceIdSynced).to.equal(true)
    });
    it("Should check if CATegory is synced", async function () {
      const { consumer } = await loadFixture(prepare)

      const hasCategory = await consumer.hasCategory(ACCOUNT_ADDRESS)
      
      expect(hasCategory).to.equal(true)
    });
  });
});
