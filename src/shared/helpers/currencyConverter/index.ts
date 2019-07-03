import { Decimal } from 'decimal.js';

import {
  ICurrencyGraph, IAbstractCurrencyPair, ICurrencyPath, ICurrencyRelation, IExchangeRateDict,
} from 'shared/types/models';

export function makeCurrencyGraph(pairs: IAbstractCurrencyPair[]): ICurrencyGraph {
  const graph: ICurrencyGraph = {};
  pairs.forEach(x => {
    if (graph[x.baseCurrency] === undefined) {
      graph[x.baseCurrency] = [];
    }

    const relations = graph[x.baseCurrency];
    if (!relations.find(y => y.code === x.counterCurrency)) {
      graph[x.baseCurrency].push({ code: x.counterCurrency, kind: 'forward' });

      if (!graph[x.counterCurrency]) {
        graph[x.counterCurrency] = [];
      }

      graph[x.counterCurrency].push({ code: x.baseCurrency, kind: 'backward' });
    }
  });

  return graph;
}

/**
 * Implements breadth-first search algorithm from `convertableCurrency` to
 * `conversionCurrency` in cyclic graph of currencies
 */
export function currencyPathBFS(
  convertableCurrency: string,
  conversionCurrency: string,
  graph: ICurrencyGraph,
): ICurrencyPath | null {

  /**
   * `loop` traverses nodes next to some path and collects `nextPaths`
   */
  function loop(
    relations: ICurrencyRelation[],
    path: ICurrencyRelation[],
    currentPaths: ICurrencyRelation[][],
    nextPaths: ICurrencyRelation[][],
  ): ICurrencyRelation[] | null {

    if (relations.length === 0) {
      return innerLoop(currentPaths, nextPaths);
    }
    const [x, ...xs] = relations;

    if (x.code === conversionCurrency) {
      return [...path, x];
    }

    if (path.find(y => y.code === x.code) || x.code === convertableCurrency) {
      return loop(xs, path, currentPaths, nextPaths);
    }

    return loop(xs, path, currentPaths, [...nextPaths, [...path, x]]);
  }

  /**
   * `innerLoop` traverses paths for neighbours with same depth level
   */
  function innerLoop(
    currentPaths: ICurrencyRelation[][],
    nextPaths: ICurrencyRelation[][],
  ): ICurrencyRelation[] | null {

    if (currentPaths.length === 0) {
      if (nextPaths.length === 0) {
        return null;
      }
      return innerLoop(nextPaths, []);
    }

    const [x, ...xs] = currentPaths;
    const relations = graph[x[x.length - 1].code];

    return loop(relations, x, xs, nextPaths);
  }

  if (convertableCurrency === conversionCurrency) {
    return {
      initialCode: convertableCurrency,
      relations: [],
    };
  }

  // default empty array for relations - in case if asset - exist, but doesnt have markets
  const currencyRelations = loop(graph[convertableCurrency] || [], [], [], []);

  if (currencyRelations) {
    return {
      initialCode: convertableCurrency,
      relations: currencyRelations,
    };
  }

  console.warn('could not find path from', convertableCurrency, 'to', conversionCurrency);

  return null;
}

export function convertCurrency(value: string | number, path: ICurrencyPath, rates: IExchangeRateDict) {
  function loop(
    currencyValue: Decimal,
    prevCode: string,
    relations: ICurrencyRelation[]
  ): Decimal | null {
    if (relations.length === 0) {
      return currencyValue;
    }

    const [x, ...xs] = relations;
    const pairKey = x.kind === 'forward'
      ? `${prevCode}_${x.code}`
      : `${x.code}_${prevCode}`;
    const convertingRate = rates[pairKey];

    if (convertingRate) {
      const converted = x.kind === 'forward'
        ? currencyValue.mul(new Decimal(convertingRate.current))
        : currencyValue.div(new Decimal(convertingRate.current));
      return loop(converted, x.code, xs);
    }

    console.warn(`no required pair key "${pairKey}" in miniticker exchange rates`);
    return null;
  }

  const decimalValue = new Decimal(value);
  const result = loop(decimalValue, path.initialCode, path.relations);

  if (
    result === null
    || isNaN(result.toNumber())
    || result.toNumber() === Infinity
  ) {
    return null;
  }

  return result;
}
