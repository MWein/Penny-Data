import * as network from '../utils/network'
import { getBalances } from './getBalances'

describe('getBalances', () => {
  it('Returns balances in the right format', async () => {
    (network.get as unknown as jest.Mock) = jest.fn().mockReturnValue({
      balances: {
        total_equity: 1000,
        total_cash: 100000,
        short_market_value: 0,
        margin: {
          option_buying_power: 700
        }
      }
    })
    const balances = await getBalances()
    expect(balances).toEqual({
      equity: 1000,
      totalCash: 100000,
      optionBuyingPower: 700
    })
  })

  it('Returns balances if cash account', async () => {
    (network.get as unknown as jest.Mock) = jest.fn().mockReturnValue({
      balances: {
        total_equity: 1000,
        total_cash: 100000,
        short_market_value: 0,
        cash: {
          cash_available: 800
        }
      }
    })
    const balances = await getBalances()
    expect(balances).toEqual({
      equity: 1000,
      totalCash: 100000,
      optionBuyingPower: 800
    })
  })
})