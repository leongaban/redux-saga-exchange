import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { IOperation, IAssetsInfoMap } from 'shared/types/models';
import { IMTableColumn } from 'shared/types/ui';
import { MTable } from 'shared/view/components';
import { actions as socketsActions } from 'services/sockets';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as configSelectors } from 'services/config';
import { formatAsset } from 'shared/helpers/number';
import { transformAssetName } from 'shared/helpers/converters';

import { actions, selectors } from '../../../../redux';
import StatusCell from '../StatusCell/StatusCell';
import OperationCell from '../OperationCell/OperationCell';
import { renderConfirmationCell, renderDateCell } from '../Cells';
import './MOperationHistory.scss';

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

type IProps = IStateProps & IActionProps & ITranslateProps;

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

const b = block('m-operation-history');

class MOperationHistory extends React.PureComponent<IProps> {
  private columns: Array<IMTableColumn<IOperation>> = [
    {
      getTitle: () => this.renderTitle('INSTRUMENT', 'DATE'),
      renderCell: ({ creationDate, asset }: IOperation) => {
        return (
          <>
            <div className={b('cell-instrument-content')()}>
              {transformAssetName(asset)}
            </div>
            <div className={b('cell-date-content')()}>
              {renderDateCell(creationDate)}
            </div>
          </>
        );
      },
    },

    {
      getTitle: () => this.renderTitle('AMOUNT', 'OPERATION'),
      renderCell: (record: IOperation) => {
        const { amount, asset } = record;
        return (
          <>
            <div className={b('cell-amount-content')()}>
              {formatAsset(asset, amount, this.props.assetsInfo)}
            </div>
            <div className={b('cell-operation-content')()}>
              <OperationCell record={record} />
            </div>
          </>
        );
      },
    },

    {
      getTitle: () => this.renderTitle('STATUS', 'CONFIRMATIONS'),
      renderCell: (record: IOperation) => {
        const { status, link } = record;
        return (
          <>
            <StatusCell status={status} link={link} translate={this.props.translate} />
            <div className={b('cell-confirmations-content')()}>
              {renderConfirmationCell(record)}
            </div>
          </>
        );
      },
      rightAligned: true,
      width: { unit: 'rem', value: 6.5714 }, // value from status cell
    },
  ];

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
    const { operations } = this.props;
    return (
      <div className={b()}>
        <MTable<IOperation>
          columns={this.columns}
          records={operations}
          getRecordID={this.getOperationID}
        />
      </div>
    );
  }

  @bind
  private getOperationID({ id }: IOperation) {
    return id;
  }

  @bind
  private renderTitle(title: string, subtitle: string) {
    return (
      <>
        <div>{title} /</div>
        <div>{subtitle}</div>
      </>
    );
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      MOperationHistory
    )));
