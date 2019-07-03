import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';

import {
  ICurrencyBalance, IBalanceSettings, IWidgetContentProps, IAssetsInfoMap, IBalanceDict,
} from 'shared/types/models';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as userSelectors } from 'services/user';
import { selectors as configSelectors } from 'services/config';
import { fractionalPartLengths } from 'shared/constants';
import { IAppReduxState } from 'shared/types/app';
import { Menu, IMenuEntry } from 'shared/view/components';
import { floorFloatToFixed } from 'shared/helpers/number';

import { actions } from '../../../../redux';
import './Content.scss';
import { transformAssetName } from 'shared/helpers/converters';

interface IStateProps {
  balanceDict: IBalanceDict;
  assetsInfo: IAssetsInfoMap;
}

interface IActionProps {
  setModalProps: typeof actions.setModalProps;
  loadDepositAddress: typeof actions.loadDepositAddress;
  reset: typeof actions.reset;
}

type IProps = IStateProps & IActionProps & ITranslateProps & IWidgetContentProps<IBalanceSettings>;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    ...actions,
  }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    balanceDict: userSelectors.selectBalanceDict(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

const b = block('balance-widget-content');

interface ICurrencyView {
  code: string;
  value: string;
}

type MaybeCurrency = ICurrencyBalance | null;

class WidgetContent extends React.PureComponent<IProps> {

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const { settings: { currencyCodes } } = this.props;

    const { balanceDict } = this.props;
    const balanceCurrencies: MaybeCurrency[] = currencyCodes.map(x => {
      if (x === '') {
        return null;
      }
      return {
        code: x,
        value: balanceDict[x] || 0,
      };
    });

    return (
      <div className={b()}>
        {balanceCurrencies.map(this.renderBalanceElement)}
      </div>
    );
  }

  @bind
  private renderBalanceElement(currency: MaybeCurrency, index: number) {
    const value = currency
      ? this.formatBalanceValue(currency)
      : '';
    return (
      <div
        className={b('balance-element')()}
        key={index}
      >
        {this.renderBalanceElementContent(
          currency
            ? { ...currency, value }
            : { code: '', value },
        )}
      </div>
    );
  }

  private renderBalanceElementContent({ code, value }: ICurrencyView) {
    const { translate: t } = this.props;
    const menuEntries: IMenuEntry[][] = [
      [{
        content: t('BALANCE:WIDGET-CONTENT:DEPOSIT-MENU-ENTRY-TEXT'),
        onClick: this.makeDepositMenuEntryClickHandler(code),
      }],
      [{
        content: t('BALANCE:WIDGET-CONTENT:WITHDRAW-MENU-ENTRY-TEXT'),
        onClick: this.makeWithdrawMenuEntryClickHandler(code),
      }],
    ];

    // TODO implement auto detection for menu position
    return (
      <React.Fragment>
        <div className={b('balance-element-code-and-menu')()}>
          <div className={b('balance-element-code')()}>
            {transformAssetName(code)}
          </div>
          <div className={b('balance-element-menu')()}>
            <Menu
              entriesSections={menuEntries}
              entryHeight="small"
              withVerticallyArrangedIcon
              menuPosition="left"
            />
          </div>
        </div>
        <div className={b('balance-element-value')()}>
          {value}
        </div>
      </React.Fragment>
    );
  }

  @bind
  private makeDepositMenuEntryClickHandler(code: string) {
    const { setModalProps, loadDepositAddress } = this.props;
    return () => {
      loadDepositAddress({ currencyCode: code });
      setModalProps({
        name: 'depositCoins',
        props: { isOpen: true, currencyCode: code }
      });
    };
  }

  @bind
  private makeWithdrawMenuEntryClickHandler(code: string) {
    const { setModalProps } = this.props;
    return () => {
      setModalProps({
        name: 'withdrawCoins',
        props: { isOpen: true, currencyCode: code },
      });
    };
  }

  @bind
  private formatBalanceValue(currency: ICurrencyBalance) {
    const { assetsInfo } = this.props;
    const accuracy = assetsInfo[currency.code]
      ? assetsInfo[currency.code].scale
      : fractionalPartLengths.cryptocurrency;
    return floorFloatToFixed(currency.value, accuracy);
  }
}

export default
  connect(mapState, mapDispatch)(
    i18nConnect(
      WidgetContent,
    ),
  );
