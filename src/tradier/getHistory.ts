import * as networkUtil from '../utils/network'


type OptionTradeHistory = {
  amount: number,
  date: string,
  type: string,
  trade: {
    commission: number,
    description: string,
    price: number,
    quantity: number,
    symbol: string,
    trade_type: 'option' | 'equity',
  }
}


const getOptionTradeHistory = async (startDate : string, endDate : string) : Promise<OptionTradeHistory[]> => {
  const url = `accounts/${process.env.ACCOUNTNUM}/history?limit=100000&type=trade&start=${startDate}&end=${endDate}`
  const response = await networkUtil.get(url)
  const historyObj = response?.history?.event

  return historyObj
}

export {
  getOptionTradeHistory
}