import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { CoinCell, Preloader } from 'shared/view/elements';
import { Table } from 'shared/view/components';
import { IAppReduxState } from 'shared/types/app';
import { ISortInfo } from 'shared/types/ui';
import {
  IAdminPanelUser, UsersBalance, ICurrencyBalance, IAssetsInfoMap, IAssetInfo,
} from 'shared/types/models';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import { formatAssetWithCommas } from 'shared/helpers/number';

import { IUserBalanceColumnData, IUserBalanceColumns } from '../../../namespace';
import { actions, selectors } from './../../../redux';
import './UserBalance.scss';

interface IOwnProps {
  currentProfile: IAdminPanelUser;
}

interface IStateProps {
  usersBalance: UsersBalance;
  assetsInfo: IAssetsInfoMap;
  isUserBalanceRequesting: boolean;
}

interface IActionProps {
  loadUserBalance: typeof actions.loadUserBalance;
}

type IProps = IOwnProps & IStateProps & IActionProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    usersBalance: selectors.selectUsersBalance(state),
    isUserBalanceRequesting: selectors.selectLoadUserBalanceCommunication(state).isRequesting,
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    loadUserBalance: actions.loadUserBalance,
    loadAssetsInfo: configActions.loadAssetsInfo,
  }, dispatch);
}

const b = block('user-balance');

class UserBalance extends React.PureComponent<IProps> {
  private columns: IUserBalanceColumns = {
    code: {
      title: () => 'Coin',
      renderCell: ({ code }: ICurrencyBalance) => {
        const assetInfo = this.getAssetInfo(code);
        if (assetInfo) {
          return <CoinCell code={code} iconSrc={assetInfo.imageUrl} />;
        } else {
          return '—';
        }
      },
    },
    name: {
      title: () => 'Coin name',
      renderCell: ({ code }: ICurrencyBalance) => {
        const assetInfo = this.getAssetInfo(code);
        if (assetInfo) {
          return assetInfo.assetName;
        } else {
          return '—';
        }
      },
    },
    value: {
      title: () => 'Balance',
      renderCell: ({ code, value }: ICurrencyBalance) => formatAssetWithCommas(code, value, this.props.assetsInfo),
    },
  };

  private sortInfo: ISortInfo<IUserBalanceColumns> = {
    column: 'code',
    kind: 'simple',
    direction: 'ascend',
  };

  public componentDidMount() {
    const { loadUserBalance, currentProfile: { id }, usersBalance } = this.props;
    const isUserBalanceLoaded = usersBalance[id] !== void 0;
    if (!isUserBalanceLoaded) {
      loadUserBalance(id);
    }
  }

  public render() {
    const { usersBalance, currentProfile: { id }, isUserBalanceRequesting } = this.props;
    return (
      <div className={b()}>
        <Preloader isShow={isUserBalanceRequesting}>
          <Table<IUserBalanceColumnData>
            records={this.addCurrenciesNamesToUserBalance(usersBalance[id])}
            columns={this.columns}
            recordIDColumn="code"
            sortInfo={this.sortInfo}
          />
        </Preloader>
      </div>
    );
  }

  private addCurrenciesNamesToUserBalance(userBalance?: ICurrencyBalance[]): IUserBalanceColumnData[] {
    if (userBalance) {
      const { assetsInfo } = this.props;
      return userBalance.map((x: ICurrencyBalance) => ({ ...x, name: assetsInfo[x.code].assetName }));
    }

    return [];
  }

  private getAssetInfo(code: string): IAssetInfo | undefined {
    const { assetsInfo } = this.props;
    const assetInfo = assetsInfo[code];
    if (assetInfo) {
      return assetInfo;
    } else {
      console.warn(`Asset info for ${code} wasn't found for the User assets table`);
    }
  }
}

export default connect(mapState, mapDispatch)(UserBalance);
