// These functions generate mock orders and position objects for use in automated tests

type EquityType = 'stock' | 'call' | 'put'
type OrderSide = 'sell_to_open'

const _generateSymbol = (
    symbol: String,
    type: EquityType
  ) : String => {
  switch (type) {
  case 'stock':
    return symbol
  case 'call':
    return `${symbol}1234C3214`
  case 'put':
    return `${symbol}1234P3214`
  }
}


const generateOrderObject = (
    symbol: String,
    quantity: Number = 1,
    type: EquityType = 'stock',
    side: OrderSide = 'sell_to_open',
    status: String ='pending',
    id: Number = 123456
  ) => {
  const ordClass = type === 'call' || type === 'put' ? 'option' : 'equity'

  const orderObj = {
    id,
    type: 'market',
    symbol,
    side,
    quantity,
    status,
    duration: 'pre',
    avg_fill_price: 0.00000000,
    exec_quantity: 0.00000000,
    last_fill_price: 0.00000000,
    last_fill_quantity: 0.00000000,
    remaining_quantity: 0.00000000,
    create_date: '2018-06-06T20:16:17.342Z',
    transaction_date: '2018-06-06T20:16:17.357Z',
    class: ordClass,
    //option_symbol: 'AAPL180720C00274000'
  }

  if (ordClass === 'option') {
    return {
      ...orderObj,
      option_symbol: _generateSymbol(symbol, type)
    }
  }

  return orderObj
}


const generatePositionObject = (
    symbol: String,
    quantity: Number = 1,
    type: EquityType ='stock',
    cost_basis: Number = 100,
    date_acquired: String = '2019-01-31T17:05',
    id: Number = 123456
  ) =>
  ({
    cost_basis,
    date_acquired,
    id,
    quantity,
    symbol: _generateSymbol(symbol, type)
  })

export {
  _generateSymbol,
  generateOrderObject,
  generatePositionObject,
}