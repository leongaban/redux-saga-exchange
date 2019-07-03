import moment from 'moment';
import * as NS from '../../namespace';
import initial from '../initial';

type StockState = NS.IReduxState['data'];

function convertCSTimestampToJsTimestamp(ts: number) {
  return ts / 10000 - 62135596800000;
}

function stringToTs(date: string): number {
  return moment.utc(date).valueOf();
}

function dataReducer(state: StockState = initial.data, action: NS.Action): StockState {
  switch (action.type) {
    case 'CHART:WS_UPDATE':
      const { type, data } = action.payload;
      switch (type) {
        case 'ChartHistory':
          if (!data.length && !state.history.length) {
            return {
              ...state,
              error: 'Currency pair data not found',
            };
          }

          const fixedData = data.map((it: any) => {
            return {
              ...it,
              ts: it.timestamp ? convertCSTimestampToJsTimestamp(it.timestamp) : stringToTs(it.start),
            };
          });
          if (!fixedData.length) {
            return state;
          }
          return {
            ...state,
            history: fixedData,
          };
        case 'exchange.history':
          return {
            ...state,
            history: data,
            currentCandle: data[data.length - 1],
          };
        case 'Chart':
          const ts = data.timestamp ? convertCSTimestampToJsTimestamp(data.timestamp) : stringToTs(data.start);
          const lastHistoryCandle = state.history[state.history.length - 1];
          if (
            (state.currentCandle && ts < state.currentCandle.ts)
            || (lastHistoryCandle && ts < lastHistoryCandle.ts)
          ) {
            return state;
          }
          return {
            ...state,
            currentCandle: {
              ts,
              open: data.open,
              close: data.close,
              high: data.high,
              low: data.low,
              volume: data.volume,
            },
            error: '',
          };
        case 'tick':
          return { ...state, currentCandle: data };
        case 'depth_tick':
          return { ...state, depthHistory: data };
        case 'error':
          return { ...state, error: data };
      }
      return state;
    default: return state;
  }
}

export { dataReducer };
