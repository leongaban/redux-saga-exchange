import { ITrade, IExtendedTrade } from 'shared/types/models';

// tslint:disable:max-line-length
export const ordersMock = {
  active: [
    {
      id: 1,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      orderType: 'Market',
      datePlaced: '2014-05-20T21:21:48Z',
    },
    {
      id: 2,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      limitPrice: 1.0,
      orderType: 'Limit',
      datePlaced: '2014-05-20T21:21:48Z',
    },
    {
      id: 3,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      orderType: 'Market',
      datePlaced: '2014-05-20T21:21:48Z',
    },
  ],
  archive: [
    {
      id: 1,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      orderType: 'Market',
      datePlaced: '2014-05-20T21:21:48Z',
    },
    {
      id: 2,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      limitPrice: 1.0,
      orderType: 'Limit',
      datePlaced: '2014-05-20T21:21:48Z',
    },
    {
      id: 3,
      orderSide: 'buy',
      market: 'Market',
      fullVolume: 1.0,
      stopPrice: 1.0,
      orderType: 'Market',
      datePlaced: '2014-05-20T21:21:48Z',
      status: 'Done',
    },
  ]
};

export const orderBookMock = {
  Instrument: 'ETHUSD',
  // totalBidVolume: '234.23',
  // averageBidPrice: {
  //   volume: '2',
  //   price: '4194.95',
  // },
  // totalAskVolume: '182.25',
  // averageAskPrice: {
  //   volume: '2',
  //   price: '4203.75',
  // },
  Bids: [
    {
      Amount: '2',
      Price: '4281.32',
    },
    {
      Amount: '3',
      Price: '4211.32',
    },
    {
      Amount: '2',
      Price: '4211.32',
    },
    {
      Amount: '5',
      Price: '4281.32',
    },
    {
      Amount: '3',
      Price: '4231.32',
    },
  ],
  Asks: [
    {
      Amount: '3',
      Price: '4211.32',
    },
    {
      Amount: '6',
      Price: '4811.32',
    },
    {
      Amount: '3',
      Price: '4211.32',
    },
    {
      Amount: '5',
      Price: '4281.32',
    },
    {
      Amount: '3',
      Price: '4231.32',
    },
  ]
};

export const tradesMock: ITrade[] = [
  {
    id: '1',
    market: 'Market1',
    exchangeRate: -10,
    amount: 1,
    date: (new Date()).toDateString(),
    type: 'sell',
  },
  {
    id: '2',
    market: 'Market2',
    exchangeRate: 20,
    amount: 3,
    date: (new Date()).toDateString(),
    type: 'sell',
  },
  {
    id: '3',
    market: 'Market3',
    exchangeRate: 30,
    amount: 4,
    date: (new Date()).toDateString(),
    type: 'sell',
  },
];

export const extendedTradesMock: IExtendedTrade[] = [
  {
    tradeSeq: 322,
    market: 'Market1',
    exchangeRate: -10,
    amount: 1,
    date: (new Date()).toDateString(),
    type: 'sell',
  },
  {
    tradeSeq: 222,
    market: 'Market2',
    exchangeRate: 20,
    amount: 3,
    comission: 0.05,
    date: (new Date()).toDateString(),
    type: 'sell',
  },
  {
    tradeSeq: 229,
    market: 'Market3',
    exchangeRate: 30,
    amount: 4,
    date: (new Date()).toDateString(),
    type: 'buy',
    comission: 0.002
  },
];
