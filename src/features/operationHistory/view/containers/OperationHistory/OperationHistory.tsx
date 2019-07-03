import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import {
  IOperation,
  IOperationHistoryColumns,
  IOperationHistoryColumnData,
  IOperationHistoryNonColumnData,
  IAssetsInfoMap,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { Table } from 'shared/view/components';
import { actions as socketsActions } from 'services/sockets';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { getTableRowHoverColor } from 'shared/view/styles/themes';
import { formatAsset } from 'shared/helpers/number';
import { transformAssetName } from 'shared/helpers/converters';

import { actions, selectors } from '../../../redux';
import StatusCell from './StatusCell/StatusCell';
import { renderConfirmationCell, renderDateCell } from './Cells';
import OperationCell from './OperationCell/OperationCell';
import './OperationHistory.scss';

interface IOwnProps {
  sortInfo?: ISortInfo<IOperation>;
  onSortInfoChange?(sortInfo: ISortInfo<IOperation>): void;
}
interface IStateProps {
  operations: IOperation[];
  assetsInfo: IAssetsInfoMap;
}

interface IActionProps {
  openChannel: typeof socketsActions.openChannel;
  closeChannel: typeof socketsActions.closeChannel;
  subscribe: typeof actions.subscribe;
  unsubscribe: typeof actions.unsubscribe;
}

type IProps = IStateProps & IActionProps & IOwnProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    operations: selectors.selectOperations(state),
    assetsInfo: configSelectors.selectAssetsInfo(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    subscribe: actions.subscribe,
    unsubscribe: actions.unsubscribe,
    openChannel: socketsActions.openChannel,
    closeChannel: socketsActions.closeChannel,
  }, dispatch);
}

const b = block('operation-history');

const OperationHistoryTable = Table as new () => Table<IOperationHistoryColumnData, IOperationHistoryNonColumnData, ''>;

class OperationHistory extends React.PureComponent<IProps> {

  private columns: IOperationHistoryColumns = {
    asset: {
      title: () => 'Instrument',
      renderCell: ({ asset }: IOperation) => {
        return <span>{transformAssetName(asset)}</span>;
      },
    },
    amount: {
      title: () => 'Amount',
      renderCell: ({ asset, amount }: IOperation) => {
        return <span>{formatAsset(asset, amount, this.props.assetsInfo)}</span>;
      },
    },
    type: {
      title: () => 'Operation',
      renderCell: (record: IOperation) => <OperationCell record={record} />,
    },
    creationDate: {
      title: () => 'Date',
      renderCell: ({ creationDate }: IOperation) => renderDateCell(creationDate),
    },
    confirmations: {
      title: () => 'Confirmations',
      renderCell: (record: IOperation) => renderConfirmationCell(record),
    },
    status: {
      title: () => 'Status',
      renderCell: ({ status, link }: IOperation) => {
        return <StatusCell status={status} link={link} translate={this.props.translate} />;
      },
    },
  };

  public componentDidMount() {
    const { openChannel, subscribe } = this.props;
    openChannel('Transfers');
    subscribe('Transfers');
  }

  public componentWillUnmount() {
    const { closeChannel, unsubscribe } = this.props;
    unsubscribe('Transfers');
    closeChannel('Transfers');
  }

  public render() {
    const { sortInfo, onSortInfoChange, operations } = this.props;
    return (
      <div className={b()}>
        <OperationHistoryTable
          columns={this.columns}
          records={operations}
          onSortInfoChange={onSortInfoChange}
          sortInfo={sortInfo}
          minWidth={50}
          recordIDColumn="id"
          getRowHoverColor={getTableRowHoverColor}
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(i18nConnect(OperationHistory));
