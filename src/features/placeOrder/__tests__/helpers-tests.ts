import { shouldShowLimitOrderPriceWarning } from '../helpers';

describe('(place order) feature', () => {
  describe('shouldShowLimitOrderPriceWarning helper', () => {
    describe('Buy form', () => {
      test('Should show warning', () => {
        const mocks = [[1.05, 1], [2, 1]];
        mocks.forEach(x => {
          expect(shouldShowLimitOrderPriceWarning(x[0], x[1], 'buy')).toEqual(true);
        });
      });

      test('Shouldnt show warning', () => {
        const mocks = [[0.9, 1], [0, 1], [1, 1], [1.02, 1]];
        mocks.forEach(x => {
          expect(shouldShowLimitOrderPriceWarning(x[0], x[1], 'buy')).toEqual(false);
        });
      });
    });

    describe('Sell form', () => {
      test('Should show warning', () => {
        const mocks = [[0.95, 1], [0, 1]];
        mocks.forEach(x => {
          expect(shouldShowLimitOrderPriceWarning(x[0], x[1], 'sell')).toEqual(true);
        });
      });

      test('Shouldnt show warning', () => {
        const mocks = [[1, 1], [1.1, 1], [0.98, 1]];
        mocks.forEach(x => {
          expect(shouldShowLimitOrderPriceWarning(x[0], x[1], 'sell')).toEqual(false);
        });
      });
    });

  });
});
