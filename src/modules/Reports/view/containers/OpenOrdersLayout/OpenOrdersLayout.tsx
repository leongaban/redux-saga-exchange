import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { Dispatch, bindActionCreators } from 'redux';
import * as R from 'ramda';

import * as features from 'features';
import featureConnect from 'core/FeatureConnector';
import * as openOrdersSelectors from 'services/openOrdersDataSource/redux/data/selectors';
import { IAppReduxState, Omit } from 'shared/types/app';
import Preloader from 'shared/view/elements/Preloader/Preloader';
import { Modal, Button } from 'shared/view/elements';
import { ModalCancel, ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import { IActiveOrderColumnData, IActiveOrder, IOrderListSettings, IReportsSettings } from 'shared/types/models';
import { settingsDefaults } from 'shared/constants';
import { actions as configActions, selectors as configSelectors } from 'services/config';

import ReportContainer from '../../components/ReportContainer/ReportContainer';
import ExportToXLSXButton from '../../components/ExportToXLSXButton/ExportToXLSXButton';

import './OpenOrdersLayout.scss';

interface IOwnProps {
  ordersFeatureEntry: features.orders.Entry;
}

interface IStateProps {
  activeOrders: IActiveOrder[];
  isCancelAllOrdersRequesting: boolean;
  reportsSettings: IReportsSettings;
}

interface IActionProps {
  submitForm: typeof submit;
  saveUserConfig: typeof configActions.saveUserConfig;
  cancelAllOrders(): void;
}

interface IState {
  isCancelAllOrdersModalOpen: boolean;
  isSettingsWindowShown: boolean;
  columns: { [key in keyof IActiveOrderColumnData]: boolean };
}

type IProps = IOwnProps & IStateProps & IActionProps & RouteComponentProps<void>;

function mapState(state: IAppReduxState, featureProps: IOwnProps): IStateProps {
  return {
    activeOrders: openOrdersSelectors.selectActiveOrders(state),
    isCancelAllOrdersRequesting: featureProps.ordersFeatureEntry.selectors.selectCancelOrdersIsRequesting(state),
    reportsSettings: configSelectors.selectReportsSettings(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>, featureProps: IOwnProps): IActionProps {
  return bindActionCreators({
    saveUserConfig: configActions.saveUserConfig,
    cancelAllOrders: featureProps.ordersFeatureEntry.actions.cancelAllOrders,
    submitForm: submit,
  }, dispatch);
}

const b = block('open-orders-layout');

const tableRecordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig = {
  initialOption: 20,
  options: [20, 30, 50, 100],
};

class OpenOrdersLayout extends React.PureComponent<IProps, IState> {

  public state: IState = {
    isSettingsWindowShown: false,
    isCancelAllOrdersModalOpen: false,
    columns: { ...settingsDefaults.orderListVisibleColumns },
  };

  public render() {
    const { ordersFeatureEntry, reportsSettings: { openOrders: { shouldOpenCancelOrderModal } } } = this.props;
    const { columns, isSettingsWindowShown, isCancelAllOrdersModalOpen } = this.state;
    const { Component: OrderListSettings } = ordersFeatureEntry.widgets.OrderList.settingsForm!;
    return (
      <ReportContainer
        title="Open Orders"
        onSettingsClick={this.handleSettingsClick}
        renderHeaderRightPart={this.renderRightControls}
      >
        <ordersFeatureEntry.containers.OrderList
          tableRecordsPerPageSelectConfig={tableRecordsPerPageSelectConfig}
          sortInfo={settingsDefaults.orderListSortInfo}
          columns={columns}
          renderTableHeader={this.renderTableHeader}
          shouldOpenCancelOrderModal={shouldOpenCancelOrderModal}
          onCancelConfirmationModalDisable={this.handleCancelConfirmationModalDisable}
        />
        <Modal isOpen={isSettingsWindowShown} title="Settings" onClose={this.handleSettingsModalClose}>
          <div className={b('settings-window')()}>
            <OrderListSettings
              initialSettings={{
                ...columns,
                shouldOpenCancelOrderModal,
              }}
              onSubmit={this.handleOrderListSettingsSubmit}
            />
            <div className={b('controls')()}>
              <div className={b('button')()}>
                <Button color="black-white" onClick={this.handleSettingsModalClose}>
                  Close
                </Button>
              </div>
              <div className={b('button')()}>
                <Button onClick={this.handleSaveButtonClick}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        {isCancelAllOrdersModalOpen && this.renderCancelAllOrdersModal()}
      </ReportContainer >
    );
  }

  @bind
  private renderRightControls() {
    return (
      <div className={b('right-controls')()}>
        <ExportToXLSXButton data={this.formattedOrders} filename="openOrders" />
      </div>
    );
  }

  @bind
  private renderTableHeader(renderPaginationControls: () => JSX.Element | null) {
    const { isCancelAllOrdersRequesting } = this.props;
    return (
      <div className={b('table-header')()}>
        <div className={b('cancel-orders-button')()}>
          <Button
            onClick={this.handleCancelAllOrdersButtonClick}
            size="medium"
            color="red"
            disabled={isCancelAllOrdersRequesting}
            isShowPreloader={isCancelAllOrdersRequesting}
          >
            Cancel all
          </Button>
        </div>
        <div className={b('pagination-controls')()}>
          {renderPaginationControls()}
        </div>
      </div>
    );
  }

  @bind
  private handleSettingsClick() {
    this.setState({
      isSettingsWindowShown: true,
    });
  }

  @bind
  private handleSettingsModalClose() {
    this.setState({
      isSettingsWindowShown: false,
    });
  }

  @bind
  private handleSaveButtonClick() {
    this.props.submitForm('orderListSettings');
  }

  @bind
  private handleOrderListSettingsSubmit(data: IOrderListSettings) {
    const shouldOpenCancelOrderModal = 'shouldOpenCancelOrderModal';
    this.saveShouldOpenCancelOrderModalSetting(data[shouldOpenCancelOrderModal]);

    const columnsOptions = R.dissoc<Omit<IOrderListSettings, 'shouldOpenCancelOrderModal'>>(
      shouldOpenCancelOrderModal,
      data,
    );
    this.setState({
      isSettingsWindowShown: false,
      columns: { ...columnsOptions },
    });
  }

  @bind
  private disableCancelConfirmationModal() {
    this.saveShouldOpenCancelOrderModalSetting(false);
  }

  @bind
  private saveShouldOpenCancelOrderModalSetting(value: boolean) {
    const { reportsSettings, saveUserConfig } = this.props;
    saveUserConfig({
      reportsSettings: {
        ...reportsSettings,
        openOrders: {
          shouldOpenCancelOrderModal: value,
        },
      }
    });
  }

  @bind
  private handleCancelConfirmationModalDisable() {
    this.disableCancelConfirmationModal();
  }

  @bind
  private handleCancelAllOrdersButtonClick() {
    const { reportsSettings: { openOrders: { shouldOpenCancelOrderModal } }, cancelAllOrders } = this.props;
    if (shouldOpenCancelOrderModal) {
      this.setState({ isCancelAllOrdersModalOpen: true });
    } else {
      cancelAllOrders();
    }
  }

  @bind
  private handleCancelAllOrdersModalClose() {
    this.setState({ isCancelAllOrdersModalOpen: false });
  }

  @bind
  private handleCancelAllOrdersModalConfirm(isDisableCancelModalCheckboxChecked?: boolean) {
    this.props.cancelAllOrders();
    if (isDisableCancelModalCheckboxChecked) {
      this.disableCancelConfirmationModal();
    }
    this.setState({ isCancelAllOrdersModalOpen: false });
  }

  private get formattedOrders() {
    const { activeOrders } = this.props;
    const { columns } = this.state;

    return activeOrders.map(R.pickBy((_, key: keyof IActiveOrder) => key in columns
      ? columns[key as keyof typeof columns]
      : false));
  }

  @bind
  private renderCancelAllOrdersModal() {
    const { isCancelAllOrdersModalOpen } = this.state;

    return (
      <ModalCancel
        isOpen={isCancelAllOrdersModalOpen}
        title="Cancel all orders"
        modalText="Are you sure you want to cancel all orders?"
        onCancel={this.handleCancelAllOrdersModalClose}
        onConfirm={this.handleCancelAllOrdersModalConfirm}
        dontShowModalCheckboxLabel="Do not show this confirmation again."
      />
    );
  }
}

export default (
  withRouter(
    featureConnect({
      ordersFeatureEntry: features.orders.loadEntry,
    }, <Preloader isShow />)(
      connect(mapState, mapDispatch)(
        OpenOrdersLayout,
      ))));
