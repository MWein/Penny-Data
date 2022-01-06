import * as networkUtil from '../utils/network'

const getWatchlistSymbols = async () : Promise<String[]> => {
  try {
    const response = await networkUtil.get('watchlists/default')
    const watchlistItems = response.watchlist.items.item

    // If theres one item in the watchlist, its an object. Why...
    if (Array.isArray(watchlistItems)) {
      return watchlistItems.map(x => x.symbol)
    } else {
      return [ watchlistItems.symbol ]
    }
  } catch (e) {
    return []
  }
}

export {
  getWatchlistSymbols
}