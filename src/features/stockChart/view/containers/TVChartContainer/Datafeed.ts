import moment from 'moment';
import * as R from 'ramda';

import {
  LibrarySymbolInfo,
  ResolutionString,
  OnReadyCallback,
  ResolveCallback,
  ErrorCallback,
  HistoryCallback,
  SubscribeBarsCallback,
} from 'shared/types/charting_library';
import { ICurrencyPair, IDataFeed, IServerCandle } from 'shared/types/models';
import {
  convertMarketFromSlashToUnderscore, convertTVChartHistory,
  convertTVChartTick,
} from 'shared/helpers/converters';
import { ActionCreator } from '../../../../../../node_modules/redux';

const supportedResolutions = ['1', '5', '3', '15', '30', '60', '120', '240', '480', '720', '1D', '3D', '1W', '1M'];

interface IActions {
  openChannel(channel: string, onEnter: () => void, instanceKey?: string): ActionCreator<void>;
  closeChannel(channel: string, instanceKey?: string): ActionCreator<void>;
  subscribeToEvent(channel: string, instanceKey: string | undefined, onTick: (data: IServerCandle) => void): void;
  executeCommand(command: string, params: any, instanceKey: string): any;
  unsubscribeFromEvent(channel: string, instanceKey: string | undefined): void;
}

export default class Datafeed implements IDataFeed {
  private actions: IActions;
  private instanceKey: string = '';
  private currentCurrencyPair: ICurrencyPair | null = null;
  private subscribers: { [key: string]: string } = {};

  constructor(params: IActions & { instanceKey?: string }) {
    const { instanceKey = '', ...actions } = params;
    this.instanceKey = instanceKey;
    this.actions = actions;
  }

  public setCurrentCurrencyPair(currentCurrencyPair: ICurrencyPair) {
    this.currentCurrencyPair = currentCurrencyPair;
  }

  public onReady(callback: OnReadyCallback) {
    callback({
      supported_resolutions: supportedResolutions,
    });
  }

  public resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback) {
    const { priceScale = 6, amountScale = 4 } = this.currentCurrencyPair || {};

    const symbolStub: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      ticker: symbolName,
      exchange: symbolName.split('/')[0],
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      intraday_multipliers: supportedResolutions,
      supported_resolutions: supportedResolutions,
      data_status: 'streaming',
      listed_exchange: 'trd.io',

      minmov: 1,
      pricescale: 10 ** priceScale,
      volume_precision: amountScale,
    };

    setTimeout(() => {
      onResolve(symbolStub);
    }, 0);
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    from: number,
    to: number,
    onHistoryCallback: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ) {
    const dtFormat = 'YYYY-MM-DDTHH:mm:ss';

    const toDate = moment.unix(to).utc().format(dtFormat);
    const fromDate = moment.unix(from).utc().format(dtFormat);

    const market = convertMarketFromSlashToUnderscore(symbolInfo.name);

    const result: IServerCandle[] = await this.actions.executeCommand(
      'ChartHistory',
      {
        Spec: `${market}@${this.convertResolution(resolution)}`,
        From: fromDate,
        To: toDate,
        Count: 10000,
      },
      this.instanceKey,
    );

    const data = convertTVChartHistory(result);

    onHistoryCallback(data, { noData: !data.length });
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
  ) {
    // tslint:disable-next-line:max-line-length
    const marketId = `${convertMarketFromSlashToUnderscore(symbolInfo.name)}@${this.convertResolution(resolution)}`;
    this.subscribers = { ...this.subscribers, [listenerGuid]: marketId };
    this.subscribeToMarket(marketId, onTick);
  }

  public unsubscribeBars(listenerGuid: string) {
    const marketId = this.subscribers[listenerGuid];
    this.subscribers = R.omit([listenerGuid], this.subscribers);
    this.unsubscribeFromMarket(marketId);
  }

  public searchSymbols() {
    // do nothing
  }

  private subscribeToMarket(marketId: string, onTick: SubscribeBarsCallback) {
    this.actions.openChannel(`Chart.${marketId}`, () => { /* */ }, this.instanceKey);
    this.actions.subscribeToEvent(`Chart.${marketId}`, this.instanceKey, (data: IServerCandle) => {
      onTick(convertTVChartTick(data));
    });
  }

  private unsubscribeFromMarket(marketId: string) {
    this.actions.unsubscribeFromEvent(`Chart.${marketId}`, this.instanceKey);
    this.actions.closeChannel(`Chart.${marketId}`, this.instanceKey);
  }

  // 60 -> 1h
  private convertResolution(resolution: ResolutionString): string {
    const period = resolution.replace(/\d/g, '');
    const interval = Number(resolution.replace(/[^\d+]/g, ''));
    switch (period) {
      case 'W':
        return `${interval}w`;
      case 'D':
        return `${interval}d`;
      case 'M':
        return `${interval}M`;
      default:
        return interval >= 60 ? `${interval / 60}h` : `${interval}m`;
    }
  }
}
