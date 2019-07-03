import * as React from 'react';
import * as R from 'ramda';
import { roundFloat as round } from '../number/roundFloat';
import { formatDecimalIfLarge, floorFloatToFixed } from 'shared/helpers/number';

import { IAssetsInfoMap } from 'shared/types/models';
import { ILPAsset } from 'shared/types/models/liquidityPool';

export const formatMoney = (num: number, type: string, assetsInfo?: IAssetsInfoMap, location?: string) => {
  const height = location === 'header' ? '24' : '14';
  const symbol = assetsInfo ? (<img className="symbol" src={assetsInfo[type].imageUrl} height={height} />) : null;
  switch (type) {
    case 'usdt': return (<span>{symbol} {formatValue(num, type, assetsInfo)}</span>);
    case 'btc': return (<span>{symbol} {formatValue(num, type, assetsInfo)}</span>);
    case 'eth': return (<span>{symbol} {formatValue(num, type, assetsInfo)}</span>);
    case 'tiox': return (<span>{symbol} {formatValue(num, type, assetsInfo)}</span>);
    default: return (<span>{symbol} {formatValue(num, type, assetsInfo)}</span>);
  }
};

export const formatValue = (value: number, asset: string, assetsInfo?: IAssetsInfoMap) => {
  if (assetsInfo) {
    const formattedValue = floorFloatToFixed(value, asset in assetsInfo ? assetsInfo[asset].scale : 2);
    return formatDecimalIfLarge(formattedValue);
  }
};

export const calculatePoolPercentage = (poolTotalValue: number, usersLockedTIO: number) =>
  poolTotalValue > 0 ? `${round(usersLockedTIO / poolTotalValue * 100, 4)}%` : 0;

export const removeCommas = (x: string) => parseFloat(x.replace(/,/g, ''));

export const sumHistoricalPayouts = (assets: ILPAsset[]) => R.sum(assets.map((asset) => asset.historical));
