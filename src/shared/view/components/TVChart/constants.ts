import { BarStyle } from 'shared/types/models';

// enum properties are taken from TV documentation
export const barStyleDict: Record<BarStyle, number> = {
  'bar': 0,
  'candle': 1,
  'line': 2,
  'area': 3,
  'heikin-ashi': 8,
  'hollow-candle': 9,
  'baseline': 10,
};
