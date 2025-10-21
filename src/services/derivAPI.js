import websocket from './websocket';

class DerivAPI {
  async initialize() {
    await websocket.connect();
  }

  authorize(token) {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('authorize', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.authorize);
        }
      });
      websocket.authorize(token);
    });
  }

  async getActiveSymbols() {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('active_symbols', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.active_symbols);
        }
      });
      websocket.getActiveSymbols();
    });
  }

  subscribeTicks(symbol, callback) {
    const unsubscribe = websocket.subscribe('tick', callback);
    websocket.subscribeTicks(symbol);
    return unsubscribe;
  }

  subscribeCandles(symbol, granularity, callback) {
    const unsubscribe = websocket.subscribe('candles', callback);
    websocket.subscribeCandles(symbol, granularity);
    return unsubscribe;
  }

  async buyContract(parameters) {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('buy', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.buy);
        }
      });
      websocket.buyContract(parameters);
    });
  }

  subscribeBalance(callback) {
    const unsubscribe = websocket.subscribe('balance', callback);
    websocket.getBalance();
    return unsubscribe;
  }

  async getPortfolio() {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('portfolio', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.portfolio);
        }
      });
      websocket.getPortfolio();
    });
  }

  async getProfitTable(dateFrom, dateTo) {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('profit_table', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.profit_table);
        }
      });
      websocket.getProfitTable(dateFrom, dateTo);
    });
  }

  subscribeProposal(proposal, callback) {
    const unsubscribe = websocket.subscribe('proposal', callback);
    websocket.getProposal(proposal);
    return unsubscribe;
  }

  async sellContract(contractId, price) {
    return new Promise((resolve, reject) => {
      const unsubscribe = websocket.subscribe('sell', (data) => {
        unsubscribe();
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.sell);
        }
      });
      websocket.sellContract(contractId, price);
    });
  }

  getOAuthURL() {
    const oauthUrl = process.env.REACT_APP_DERIV_OAUTH_URL;
    const appId = process.env.REACT_APP_DERIV_APP_ID;
    const callbackUrl = encodeURIComponent(process.env.REACT_APP_CALLBACK_URL);
    
    return `${oauthUrl}?app_id=${appId}&l=EN&brand=deriv`;
  }

  disconnect() {
    websocket.disconnect();
  }
}

export default new DerivAPI();