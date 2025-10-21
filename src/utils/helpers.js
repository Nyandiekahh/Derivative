// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (number, decimals = 2) => {
  return Number(number).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format date
export const formatDate = (timestamp, format = 'full') => {
  const date = new Date(timestamp * 1000);
  
  if (format === 'full') {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (format === 'date') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleString();
};

// Calculate profit/loss percentage
export const calculatePLPercentage = (buyPrice, sellPrice) => {
  if (!buyPrice || buyPrice === 0) return 0;
  return ((sellPrice - buyPrice) / buyPrice) * 100;
};

// Truncate text
export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Get contract type name
export const getContractTypeName = (contractType) => {
  const typeMap = {
    CALL: 'Rise',
    PUT: 'Fall',
    DIGITMATCH: 'Matches',
    DIGITDIFF: 'Differs',
    DIGITEVEN: 'Even',
    DIGITODD: 'Odd',
    DIGITOVER: 'Over',
    DIGITUNDER: 'Under',
  };
  return typeMap[contractType] || contractType;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};