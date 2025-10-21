export const CONTRACT_TYPES = {
  MATCH_DIFF: {
    id: 'DIGITDIFF',
    name: 'Matches/Differs',
    description: 'Predict if the last digit of the last tick will match or differ from your prediction',
    subtypes: [
      { id: 'DIGITMATCH', name: 'Matches', description: 'Last digit matches your prediction' },
      { id: 'DIGITDIFF', name: 'Differs', description: 'Last digit differs from your prediction' }
    ]
  },
  EVEN_ODD: {
    id: 'DIGITODD',
    name: 'Even/Odd',
    description: 'Predict if the last digit of the last tick will be even or odd',
    subtypes: [
      { id: 'DIGITEVEN', name: 'Even', description: 'Last digit is even' },
      { id: 'DIGITODD', name: 'Odd', description: 'Last digit is odd' }
    ]
  },
  OVER_UNDER: {
    id: 'DIGITOVER',
    name: 'Over/Under',
    description: 'Predict if the last digit of the last tick will be over or under a specific number',
    subtypes: [
      { id: 'DIGITOVER', name: 'Over', description: 'Last digit is over 5' },
      { id: 'DIGITUNDER', name: 'Under', description: 'Last digit is under 5' }
    ]
  }
};

export const DURATION_TYPES = {
  TICK: { id: 't', name: 'Ticks', min: 5, max: 10 },
  SECOND: { id: 's', name: 'Seconds', min: 15, max: 3600 },
  MINUTE: { id: 'm', name: 'Minutes', min: 1, max: 1440 }
};

export const CHART_GRANULARITY = {
  TICK: 0,
  MINUTE_1: 60,
  MINUTE_5: 300,
  MINUTE_15: 900,
  MINUTE_30: 1800,
  HOUR_1: 3600,
  HOUR_4: 14400,
  DAY_1: 86400
};