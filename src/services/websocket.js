class DerivWebSocket {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.requestId = 1;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const wsUrl = process.env.REACT_APP_DERIV_WEBSOCKET_URL;
      const appId = process.env.REACT_APP_DERIV_APP_ID;
      
      this.ws = new WebSocket(`${wsUrl}?app_id=${appId}`);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket Closed');
        this.attemptReconnect();
      };
    });
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const requestData = {
        ...data,
        req_id: this.requestId++
      };
      this.ws.send(JSON.stringify(requestData));
      return requestData.req_id;
    } else {
      console.error('WebSocket is not connected');
      return null;
    }
  }

  subscribe(msgType, callback) {
    if (!this.subscribers.has(msgType)) {
      this.subscribers.set(msgType, []);
    }
    this.subscribers.get(msgType).push(callback);
    
    return () => {
      const callbacks = this.subscribers.get(msgType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  handleMessage(data) {
    const msgType = data.msg_type;
    
    if (this.subscribers.has(msgType)) {
      this.subscribers.get(msgType).forEach(callback => callback(data));
    }

    if (this.subscribers.has('all')) {
      this.subscribers.get('all').forEach(callback => callback(data));
    }
  }

  authorize(token) {
    return this.send({
      authorize: token
    });
  }

  getActiveSymbols(productType = 'basic') {
    return this.send({
      active_symbols: productType,
      product_type: productType
    });
  }

  subscribeTicks(symbol) {
    return this.send({
      ticks: symbol,
      subscribe: 1
    });
  }

  subscribeCandles(symbol, granularity = 60) {
    return this.send({
      ticks_history: symbol,
      adjust_start_time: 1,
      count: 1000,
      end: 'latest',
      granularity: granularity,
      style: 'candles',
      subscribe: 1
    });
  }

  unsubscribe(subscriptionId) {
    return this.send({
      forget: subscriptionId
    });
  }

  buyContract(parameters) {
    return this.send({
      buy: 1,
      parameters: parameters,
      price: parameters.amount
    });
  }

  getBalance() {
    return this.send({
      balance: 1,
      subscribe: 1
    });
  }

  getPortfolio() {
    return this.send({
      portfolio: 1
    });
  }

  getProfitTable(dateFrom, dateTo) {
    return this.send({
      profit_table: 1,
      description: 1,
      date_from: dateFrom,
      date_to: dateTo
    });
  }

  sellContract(contractId, price) {
    return this.send({
      sell: contractId,
      price: price
    });
  }

  getProposal(proposal) {
    return this.send({
      proposal: 1,
      ...proposal,
      subscribe: 1
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new DerivWebSocket();