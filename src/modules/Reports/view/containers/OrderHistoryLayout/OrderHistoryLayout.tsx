import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { submit } from 'redux-form';

import featureConnect from 'core/FeatureConnector';
import * as features from 'features';
import { IArchiveOrderColumnData, IArchiveOrder } from 'shared/types/models';
import { Button, Modal } from 'shared/view/elements';
import { settingsDefaults } from 'shared/constants';
import { IAppReduxState } from 'shared/types/app';
import {
  selectors as openOrdersSelectors,
} from 'services/openOrdersDataSource';
import Preloader from 'shared/view/elements/Preloader/Preloader';

import ReportContainer from '../../components/ReportContainer/ReportContainer';
import ExportToXLSXButton from '../../components/ExportToXLSXButton/ExportToXLSXButton';
import './OrderHistoryLayout.scss';

interface IOwnProps {
  ordersEntry: features.orders.Entry;
}

interface IActionProps {
  submitForm: typeof submit;
}

interface IStateProps {
  orders: IArchiveOrder[];
}

interface IState {
  isSettingsWindowShown: boolean;
  columnsToDisplay: Record<keyof IArchiveOrderColumnData, boolean>;
}

type IProps = IOwnProps & IActionProps & IStateProps & RouteComponentProps<void>;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: openOrdersSelectors.selectReportArchiveOrders(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    submitForm: submit,
  }, dispatch);
}

const b = block('order-history-layout');

class OrderHistoryLayout extends React.PureComponent<IProps, IState> {

  public state: IState = {
    isSettingsWindowShown: false,
    columnsToDisplay: settingsDefaults.orderHistoryVisibleColumns,
  };

  public render() {
    const { ordersEntry } = this.props;
    const { columnsToDisplay, isSettingsWindowShown } = this.state;
    return (
      <ReportContainer
        title="Order History"
        onSettingsClick={this.handleSettingsClick}
        renderHeaderRightPart={this.renderHeaderRightControls}
      >
        <ordersEntry.containers.OrderHistoryReport
          columnsToDisplay={columnsToDisplay}
        />
        <Modal isOpen={isSettingsWindowShown} title="Settings" onClose={this.handleModalClose}>
          <div className={b('settings-window')()}>
            <ordersEntry.containers.OrderHistorySettings
              initialSettings={columnsToDisplay}
              onSubmit={this.handleFormSubmit}
            />
            <div className={b('controls')()}>
              <div className={b('button')()}>
                <Button color="black-white" onClick={this.handleModalClose}>
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
      </ReportContainer>
    );
  }

  @bind
  private renderHeaderRightControls() {
    return (
      <ExportToXLSXButton data={this.props.orders} filename="orderHistory" />
    );
  }

  @bind
  private handleSettingsClick() {
    this.setState({
      isSettingsWindowShown: true,
    });
  }

  @bind
  private handleModalClose() {
    this.setState({
      isSettingsWindowShown: false,
    });
  }

  @bind
  private handleSaveButtonClick() {
    this.props.submitForm('orderHistorySettings');
  }

  @bind
  private handleFormSubmit(data: Record<keyof IArchiveOrderColumnData, boolean>) {
    this.setState({
      isSettingsWindowShown: false,
      columnsToDisplay: { ...data },
    });
  }
}

export default (
  withRouter(
    featureConnect({
      ordersEntry: features.orders.loadEntry,
    }, <Preloader isShow />)(
      connect<IStateProps, IActionProps, IOwnProps>(mapState, mapDispatch)(
        OrderHistoryLayout,
      ))));
