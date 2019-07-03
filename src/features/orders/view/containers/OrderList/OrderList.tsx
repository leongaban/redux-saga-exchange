import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { selectors as openOrdersSelectors } from 'services/openOrdersDataSource';
import moment from 'services/moment';
import {
  IActiveOrder,
  IActiveOrderColumns,
  IActiveOrderColumnData,
  IArchiveOrder,
  OrderValueFormatter,
} from 'shared/types/models';

import { ISortInfo } from 'shared/types/ui';
import { ModalCancel, ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import { Button } from 'shared/view/elements';
import { selectors as configSelectors } from 'services/config';
import OpenOrdersTable from '../OpenOrdersTable/OpenOrdersTable';

import { actions, selectors } from './../../../redux';
import './OrderList.scss';

interface IStateProps {
  orders: IActiveOrder[];
  isCancelModalOpen: boolean;
  modalId?: number;
  currentOrder: IActiveOrder | IArchiveOrder;
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
}

interface IActionProps {
  cancelOrder: typeof actions.cancelOrder;
  setIsCancelModalOpen: typeof actions.setIsCancelModalOpen;
  setCurrentOrder: typeof actions.setCurrentOrder;
}

interface IOwnProps {
  columns: Record<keyof IActiveOrderColumns, boolean>;
  shouldOpenCancelOrderModal: boolean;
  tableRecordsPerPageSelectConfig?: ITableRecordsPerPageSelectConfig;
  sortInfo?: ISortInfo<IActiveOrderColumnData>;
  onCancelConfirmationModalDisable(): void;
  filterPredicate?(order: IActiveOrder): boolean;
  onSortInfoChange?(sortInfo: ISortInfo<IActiveOrderColumnData>): void;
  onShareButtonClick?(message: string): void;
  renderTableHeader?(renderPaginationControls: () => JSX.Element | null): JSX.Element;
}

type IProps = IStateProps & IOwnProps & IActionProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: openOrdersSelectors.selectActiveOrders(state),
    isCancelModalOpen: selectors.selectIsCancelModalOpen(state),
    modalId: selectors.selectModalId(state),
    currentOrder: selectors.selectCurrentOrder(state),
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    cancelOrder: actions.cancelOrder,
    setIsCancelModalOpen: actions.setIsCancelModalOpen,
    setCurrentOrder: actions.setCurrentOrder,
  }, dispatch);
}

const b = block('order-list');

class OrderList extends React.PureComponent<IProps> {
  private orderListId: number = Math.random();

  public render() {
    const {
      orders, isCancelModalOpen, sortInfo, filterPredicate, onSortInfoChange, tableRecordsPerPageSelectConfig,
      renderTableHeader, columns, modalId
    } = this.props;

    // TODO aggregate columns in settings form
    const records = filterPredicate
      ? orders.filter(filterPredicate)
      : orders;

    return (
      <div className={b()}>
        <OpenOrdersTable
          columnsToDisplay={columns}
          records={records}
          sortInfo={sortInfo}
          recordsPerPageSelectConfig={tableRecordsPerPageSelectConfig}
          onSortInfoChange={onSortInfoChange}
          renderActionsCell={this.renderActions}
          renderHeader={renderTableHeader}
        />
        {isCancelModalOpen && modalId === this.orderListId && this.renderCancelWindow()}
      </div>
    );
  }

  @bind
  private renderActions(order: IActiveOrder) {
    const { onShareButtonClick } = this.props;
    const handleCancelButtonClick = this.makeCancelButtonClickHandler(order);
    const handleShareButtonClick = this.makeShareButtonClickHandler(order, onShareButtonClick);

    return (
      <div className={b('actions')()}>
        <div className={b('button', { cancel: true })()}>
          <Button onClick={handleCancelButtonClick} size="small" color="text-red">
            Cancel
          </Button>
        </div>
        {onShareButtonClick && (
          <div className={b('button', { share: true })()}>
            <Button onClick={handleShareButtonClick} size="small" color="text-blue">
              Share
            </Button>
          </div>)
        }
      </div>
    );
  }

  @bind
  private renderCancelWindow() {
    const { currentOrder } = this.props;
    const handleConfirmModalClick = this.makeConfirmCancelModalClickHandler(currentOrder.id);
    const { isCancelModalOpen } = this.props;
    return (
      <ModalCancel
        isOpen={isCancelModalOpen}
        title="Cancel order"
        modalText="Are you sure you want to cancel this order?"
        dontShowModalCheckboxLabel="Do not show this confirmation again."
        onCancel={this.handleCancelModalCancelButtonCick}
        onConfirm={handleConfirmModalClick}
      />
    );
  }

  @bind
  private handleCancelModalCancelButtonCick() {
    const { setIsCancelModalOpen } = this.props;
    setIsCancelModalOpen({ isOpen: false, id: this.orderListId });
  }

  @bind
  private handleCancelButtonClick(currentOrder: IActiveOrder) {
    const { setIsCancelModalOpen, setCurrentOrder, shouldOpenCancelOrderModal, cancelOrder } = this.props;
    setCurrentOrder(currentOrder);
    if (shouldOpenCancelOrderModal) {
      setIsCancelModalOpen({ isOpen: true, id: this.orderListId });
    } else {
      cancelOrder(currentOrder.id);
    }
  }

  @bind
  private makeCancelButtonClickHandler(currentOrder: IActiveOrder) {
    return () => {
      this.handleCancelButtonClick(currentOrder);
    };
  }

  @bind
  private makeConfirmCancelModalClickHandler(selectedIdRow: number) {
    const { cancelOrder, onCancelConfirmationModalDisable } = this.props;
    return (isDisableCancelModalCheckboxChecked?: boolean) => {
      cancelOrder(selectedIdRow);
      if (isDisableCancelModalCheckboxChecked) {
        onCancelConfirmationModalDisable();
      }
    };
  }

  @bind
  private handleShareButtonClick(
    currentOrder: IActiveOrder,
    onShareButtonClick?: (message: string) => void,
  ) {
    const { orderType, market, fullVolume, limitPrice, datePlaced } = currentOrder;
    const message = `${orderType}, ${market}, ${fullVolume}, ${limitPrice}, ${moment(datePlaced).format('L HH:mm')}`;
    onShareButtonClick && onShareButtonClick(message);
  }

  @bind
  private makeShareButtonClickHandler(
    currentOrder: IActiveOrder,
    onShareButtonClick?: (message: string) => void,
  ) {
    return () => {
      this.handleShareButtonClick(currentOrder, onShareButtonClick);
    };
  }
}

export default connect(mapState, mapDispatch)(OrderList);
