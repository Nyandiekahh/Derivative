// Market categories for organizing symbols
export const MARKET_CATEGORIES = {
  SYNTHETIC_INDEX: 'synthetic_index',
  FOREX: 'forex',
  COMMODITIES: 'commodities',
  STOCK_INDICES: 'stock_indices',
  CRYPTOCURRENCY: 'cryptocurrency',
};

export const MARKET_NAMES = {
  synthetic_index: 'Synthetic Indices',
  forex: 'Forex',
  commodities: 'Commodities',
  stock_indices: 'Stock Indices',
  cryptocurrency: 'Cryptocurrencies',
};

// This will be dynamically populated from Deriv API
// These are just examples of what markets are available
export const DEFAULT_MARKETS = [
  'synthetic_index',
  'forex',
  'commodities',
  'stock_indices',
  'cryptocurrency'
];