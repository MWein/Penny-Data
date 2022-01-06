const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

type OptionType = 'put' | 'call' | 'neither'

const determineOptionTypeFromSymbol = (symbol: String) : OptionType => {
  if (!isOption(symbol)) {
    return 'neither'
  }
  const lettersInSymbol = symbol.split('').filter(char => !nums.includes(char))
  const lastChar = lettersInSymbol[lettersInSymbol.length - 1]
  if (lastChar === 'P') {
    return 'put'
  } else {
    return 'call'
  }
}

const isOption = (symbol: String) : Boolean => symbol.split('').some(char => nums.includes(char))

const getUnderlying = (symbol: String) : String =>
  isOption(symbol) ? symbol.split('').filter(char => !nums.includes(char)).slice(0, -1).join('') : symbol

export {
  determineOptionTypeFromSymbol,
  isOption,
  getUnderlying,
}