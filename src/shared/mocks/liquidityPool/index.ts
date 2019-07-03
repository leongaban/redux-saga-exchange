import { ITier } from 'shared/types/models/liquidityPool';

export const poolTiers: ITier[] = [
  { rank: '1', tier: 2500, multiplier: 10 },
  { rank: '2', tier: 5000, multiplier: 20 },
  { rank: '3', tier: 7500, multiplier: 30 },
  { rank: '4', tier: 10000, multiplier: 40 },
  { rank: '5', tier: 12500, multiplier: 50 },
  { rank: '6', tier: 15000, multiplier: 60 },
  { rank: '7', tier: 17500, multiplier: 70 },
  { rank: '8', tier: 20000, multiplier: 80 },
  { rank: '9', tier: 22500, multiplier: 90 },
  { rank: '10', tier: 25000, multiplier: 110 }
];

export const tioTiers = [
  { rank: 1, count: '2500', percent: '10%', bold: false },
  { rank: 2, count: '5000', percent: '20%', bold: false },
  { rank: 3, count: '7500', percent: '30%', bold: false },
  { rank: 4, count: '10000', percent: '40%', bold: false },
  { rank: 5, count: '12500', percent: '50%', bold: false },
  { rank: 6, count: '15000', percent: '60%', bold: false },
  { rank: 7, count: '17500', percent: '70%', bold: false },
  { rank: 8, count: '20000', percent: '80%', bold: false },
  { rank: 9, count: '22500', percent: '90%', bold: false },
  { rank: 10, count: '25000', percent: '110%', bold: false }
];

export const lpCurrencySelections = ['usdt', 'btc', 'eth', 'tiox'];
