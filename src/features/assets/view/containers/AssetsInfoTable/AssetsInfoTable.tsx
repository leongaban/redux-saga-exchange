import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bind } from 'decko';
import { Dispatch, bindActionCreators } from 'redux';

import { Table } from 'shared/view/components';
import { Button, Icon } from 'shared/view/elements';
import {
  IAssetsInfoMap, IAssetInfoTableColumnData, IAssetInfoTableNonColumnData,
  IAssetInfoColumns, IAssetInfo,
} from 'shared/types/models';
import { selectors as configSelectors, actions as configActions } from 'services/config/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { IAppReduxState } from 'shared/types/app';

import { actions } from '../../../redux';
import './AssetsInfoTable.scss';

interface IStateProps {
  assetsInfo: IAssetsInfoMap;
}

interface IDispatchProps {
  setEditAssetModalState: typeof actions.setEditAssetModalState;
  setCurrentAsset: typeof actions.setCurrentAsset;
  loadAssetsInfo: typeof configActions.loadAssetsInfo;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    setEditAssetModalState: actions.setEditAssetModalState,
    setCurrentAsset: actions.setCurrentAsset,
    loadAssetsInfo: configActions.loadAssetsInfo,
  }, dispatch);
}

const b = block('assets-info-table');

const AssetsInfo = Table as new () => Table<IAssetInfoTableColumnData, IAssetInfoTableNonColumnData, 'editAsset'>;

class AssetsInfoTable extends React.PureComponent<IProps> {

  private columns: IAssetInfoColumns = (() => {
    const { translate: t } = this.props;
    return {
      assetName: {
        title: () => t('ADMIN:ASSETS:ASSET'),
        renderCell: this.renderAssetCell,
      },
      withdrawalFee: {
        title: () => t('ADMIN:ASSETS:WITHDRAWAL-FEE'),
      },
      scale: {
        title: () => t('ADMIN:ASSETS:SCALE'),
      },
      canWithdrawal: {
        title: () => t('ADMIN:ASSETS:CAN-WITHDRAW'),
        renderCell: this.renderCanWithdrawCell,
      },
      canDeposit: {
        title: () => t('ADMIN:ASSETS:CAN-DEPOSIT'),
        renderCell: this.renderCanDepositCell,
      },
    };
  })();

  private extraColumn = (() => {
    const { translate: t } = this.props;
    return {
      editAsset: {
        title: () => t('ADMIN:ASSETS:EDIT'),
        isSortable: false,
        renderCell: this.renderEditAssetColumn,
        width: 5,
      },
    };
  })();

  public componentDidMount() {
    this.props.loadAssetsInfo();
  }

  public render() {
    const { assetsInfo } = this.props;
    const tableRecords = Object.values(assetsInfo);

    return (
      <div className={b()}>
        <AssetsInfo
          columns={this.columns}
          records={tableRecords}
          recordIDColumn="assetName"
          extraColumns={this.extraColumn}
        />
      </div>
    );
  }

  private renderAssetCell(asset: IAssetInfo) {
    return (
      <div className={b('asset')()}>
        <img
          className={b('asset-icon')()}
          src={asset.imageUrl}
          alt={asset.assetName}
        />
        <div className={b('asset-label')()}>
          {asset.assetName}
        </div>
      </div>
    );
  }

  @bind
  private renderCanWithdrawCell(asset: IAssetInfo) {
    return this.renderBooleanCell(asset.canWithdrawal);
  }

  @bind
  private renderCanDepositCell(asset: IAssetInfo) {
    return this.renderBooleanCell(asset.canDeposit);
  }

  private renderBooleanCell(cellValue: boolean) {
    const cellIcon = cellValue ? require('./img/true-inline.svg') : require('./img/false-inline.svg');
    return <Icon className={b('boolean-field-icon', { status: cellValue ? 'true' : 'false' })()} src={cellIcon} />;
  }

  @bind
  private renderEditAssetColumn(asset: IAssetInfo) {
    const { translate: t } = this.props;
    return (
      <Button
        onClick={this.makeEditAssetButtonClickHandler(asset)}
        size="small"
        color="text-blue"
      >
        {t('SHARED:BUTTONS:EDIT')}
      </Button>
    );
  }

  @bind
  private makeEditAssetButtonClickHandler(asset: IAssetInfo) {
    return () => {
      const { setEditAssetModalState, setCurrentAsset } = this.props;
      setCurrentAsset(asset);
      setEditAssetModalState(true);
    };
  }
}

export default connect(mapState, mapDispatch)(i18nConnect(AssetsInfoTable));
