import { IAbstractCurrencyPair, IExchangeRateDict } from 'shared/types/models';

import { makeCurrencyGraph, convertCurrency, currencyPathBFS } from '../';

// TODO tests are failed
function convertCurrencyFromPairs(
  value: number,
  convertableCurrency: string,
  conversionCurrency: string,
  pairs: IAbstractCurrencyPair[],
  exchangeRates: IExchangeRateDict,
) {
  const graph = makeCurrencyGraph(pairs);
  const path = currencyPathBFS(convertableCurrency, conversionCurrency, graph);
  if (path) {
    return convertCurrency(value, path, exchangeRates);
  }
}

test('single step forward', () => {
  expect(
    convertCurrencyFromPairs(
      1,
      'eur',
      'usd',
      [{ baseCurrency: 'eur', counterCurrency: 'usd' }],
      {
        eur_usd: {
          current: 1.3,
        } as any,
      },
    )!.equals(1.3),
  ).toBe(true);
});

test('single step backward', () => {
  expect(
    convertCurrencyFromPairs(
      1.3,
      'usd',
      'eur',
      [{ baseCurrency: 'eur', counterCurrency: 'usd' }],
      {
        eur_usd: {
          current: 1.3,
        } as any,
      },
    )!.equals(1),
  ).toBe(true);
});

test('double step forward', () => {
  expect(
    convertCurrencyFromPairs(
      1,
      'eur',
      'btc',
      [
        { baseCurrency: 'eur', counterCurrency: 'usd' },
        { baseCurrency: 'usd', counterCurrency: 'btc' },
      ],
      {
        eur_usd: {
          current: 1.3,
        } as any,
        usd_btc: {
          current: 2,
        } as any,
      },
    )!.equals(2.6),
  ).toBe(true);
});

test('double step backward', () => {
  expect(
    convertCurrencyFromPairs(
      1.3,
      'usd',
      'btc',
      [
        { baseCurrency: 'eur', counterCurrency: 'usd' },
        { baseCurrency: 'eur', counterCurrency: 'btc' },
      ],
      {
        eur_usd: {
          current: 1.3,
        } as any,
        eur_btc: {
          current: 2,
        } as any,
      },
    )!.equals(2),
  ).toBe(true);
});

interface IConversionTestIO {
  from: string;
  to: string;
  res: number;
}

describe('complex test', () => {
  const testData: IConversionTestIO[] = [
    { from: 'btc', to: 'btc', res: 1 },
    { from: 'btc', to: 'usd', res: 10 },
    { from: 'btc', to: 'eth', res: 2 },
    { from: 'btc', to: 'ltc', res: 2 },

    { from: 'eth', to: 'eth', res: 1 },
    { from: 'eth', to: 'btc', res: 0.5 },
    { from: 'eth', to: 'usd', res: 5 },
    { from: 'eth', to: 'ltc', res: 1 },

    { from: 'ltc', to: 'ltc', res: 1 },
    { from: 'ltc', to: 'btc', res: 0.5 },
    { from: 'ltc', to: 'usd', res: 5 },
    { from: 'ltc', to: 'eth', res: 1 },
  ];

  testData.forEach(x => {
    test(`with ${JSON.stringify(x)}`, () => {
      expect(convertCurrencyFromPairs(
        1,
        x.from,
        x.to,
        [
          { baseCurrency: 'btc', counterCurrency: 'usd' },
          { baseCurrency: 'eth', counterCurrency: 'usd' },
          { baseCurrency: 'eth', counterCurrency: 'ltc' },
        ],
        {
          btc_usd: {
            current: 10,
          } as any,
          eth_usd: {
            current: 5,
          } as any,
          eth_ltc: {
            current: 1,
          } as any,
        },
      )!.equals(x.res)).toBe(true);
    });
  });
});
