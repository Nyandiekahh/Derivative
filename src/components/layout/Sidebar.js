import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, Search } from 'lucide-react';
import { setSelectedSymbol } from '../../redux/slices/tradeSlice';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { symbolsByMarket, activeSymbols } = useSelector((state) => state.market);
  const { selectedSymbol } = useSelector((state) => state.trade);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMarkets, setExpandedMarkets] = useState(['synthetic_index']);

  const toggleMarket = (market) => {
    setExpandedMarkets((prev) =>
      prev.includes(market)
        ? prev.filter((m) => m !== market)
        : [...prev, market]
    );
  };

  const handleSymbolSelect = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
  };

  const filteredSymbols = activeSymbols.filter((symbol) =>
    symbol.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symbol.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredMarkets = () => {
    if (searchQuery) {
      const markets = {};
      filteredSymbols.forEach((symbol) => {
        const market = symbol.market || 'other';
        if (!markets[market]) {
          markets[market] = [];
        }
        markets[market].push(symbol);
      });
      return markets;
    }
    return symbolsByMarket;
  };

  const markets = getFilteredMarkets();

  const marketNames = {
    synthetic_index: 'Synthetic Indices',
    forex: 'Forex',
    commodities: 'Commodities',
    stock_indices: 'Stock Indices',
    cryptocurrency: 'Cryptocurrencies',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Markets</h3>
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="markets-list">
        {Object.keys(markets).map((market) => (
          <div key={market} className="market-group">
            <button
              className="market-header"
              onClick={() => toggleMarket(market)}
            >
              <ChevronRight
                size={16}
                className={`chevron ${
                  expandedMarkets.includes(market) ? 'expanded' : ''
                }`}
              />
              <span>{marketNames[market] || market}</span>
              <span className="market-count">{markets[market]?.length || 0}</span>
            </button>

            {expandedMarkets.includes(market) && (
              <div className="symbols-list">
                {markets[market]?.map((symbol) => (
                  <button
                    key={symbol.symbol}
                    className={`symbol-item ${
                      selectedSymbol === symbol.symbol ? 'active' : ''
                    }`}
                    onClick={() => handleSymbolSelect(symbol.symbol)}
                  >
                    <span className="symbol-name">{symbol.display_name}</span>
                    <span className="symbol-code">{symbol.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;