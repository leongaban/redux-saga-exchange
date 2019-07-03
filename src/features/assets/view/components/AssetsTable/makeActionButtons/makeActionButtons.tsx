import * as React from 'react';

import { TranslateFunction } from 'services/i18n/namespace';
import { ICurrencyPair, IAssetsInfoMap, IAsset } from 'shared/types/models';
import { Menu, IMenuEntry, SimplexSection } from 'shared/view/components';
import { Button } from 'shared/view/elements';
import { transformAssetName } from 'shared/helpers/converters';

interface IProps {
  assetsInfo: IAssetsInfoMap;
  translate: TranslateFunction;
  getAssetCurrencyPairs(assetCode: string): ICurrencyPair[];
  onDepositButtonClick(assetCode: string): void;
  onWithdrawButtonClick(assetCode: string): void;
  onSimplexButtonClick(assetCode: string): void;
  onTradeMenuEntrySelect(x: ICurrencyPair): void;
}

type TextTransform = 'uppercase' | 'capitalize';

export function makeActionButtons(props: IProps) {
  const {
    assetsInfo, getAssetCurrencyPairs, translate: t, onDepositButtonClick, onWithdrawButtonClick,
    onTradeMenuEntrySelect, onSimplexButtonClick
  } = props;

  const makeDepositButtonClickHandler = (assetCode: string) => () => onDepositButtonClick(assetCode);
  const makeWithdrawButtonClickHandler = (assetCode: string) => () => onWithdrawButtonClick(assetCode);
  const makeSimplexClickHandler = (assetCode: string) => () => onSimplexButtonClick(assetCode);

  return {
    renderDeposit: ({ code }: IAsset, textTransform?: TextTransform) => {
      const assetInfo = assetsInfo[code];
      return (
        <Button
          size="small"
          color="text-blue"
          onClick={makeDepositButtonClickHandler(code)}
          disabled={assetInfo && !assetInfo.canDeposit}
          textTransform={textTransform}
        >
          {t('BALANCE:ASSETS:DEPOSIT-BUTTON-LABEL')}
        </Button>
      );
    },

    renderWithdraw: ({ code }: IAsset, textTransform?: TextTransform) => {
      const assetInfo = assetsInfo[code];
      return (
        <Button
          size="small"
          color="text-blue"
          onClick={makeWithdrawButtonClickHandler(code)}
          disabled={assetInfo && !assetInfo.canWithdrawal}
          textTransform={textTransform}
        >
          {t('BALANCE:ASSETS:WITHDRAW-BUTTON-LABEL')}
        </Button>
      );
    },

    renderTrade: ({ code }: IAsset, menuScrollableParent?: HTMLElement, textTransform?: TextTransform) => {
      const tradeMenuEntries = getAssetCurrencyPairs(code).map((x: ICurrencyPair): IMenuEntry => ({
        content: transformAssetName(`${x.baseCurrency}/${x.counterCurrency}`),
        onClick: () => onTradeMenuEntrySelect(x),
      }));

      return (
        <Menu
          entriesSections={[tradeMenuEntries]}
          menuPosition="left"
          scrollableParent={menuScrollableParent}
        >
          <Button size="small" color="text-blue" textTransform={textTransform}>
            {t('BALANCE:ASSETS:TRADE-BUTTON-LABEL')}
          </Button>
        </Menu>
      );
    },

    renderSimplex: ({ code }: IAsset) => {
      const assetInfo = assetsInfo[code];
      return assetInfo && assetInfo.canDeposit && (
        <SimplexSection isIcon={true} currency={code} openSimplexModal={makeSimplexClickHandler(code)} />
      );
    }
  };
}
