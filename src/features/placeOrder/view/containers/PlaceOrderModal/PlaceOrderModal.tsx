import * as React from 'react';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import block from 'bem-cn';

import { IAppReduxState } from 'shared/types/app';
import { ICurrencyPair } from 'shared/types/models';

import { Modal } from 'shared/view/elements/';
import { isSuccessedByState } from 'shared/helpers/redux';
import { ICommunication } from 'shared/types/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { actions, selectors } from '../../../redux';
import * as NS from '../../../namespace';
import SinglePlaceOrderForm from '../SinglePlaceOrderForm/SinglePlaceOrderForm';
import './PlaceOrderModal.scss';

interface IDispatchProps {
  setPlaceOrderModal: typeof actions.setPlaceOrderModal;
  setFormPriceUpdate: typeof actions.setFormPriceUpdate;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps & IOwnProps;

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

interface IStateProps {
  placeOrderModal: NS.IPlaceOrderModal;
  placeOrderCommunication: ICommunication;
  singlePlaceOrderForm: NS.ISinglePlaceOrderForm;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    placeOrderModal: selectors.selectPlaceOrderModal(state),
    placeOrderCommunication: selectors.selectCommunicationPlaceOrder(state),
    singlePlaceOrderForm: selectors.selectSinglePlaceOrderForm(state, 'modal'),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators(actions, dispatch);
}

const b = block('place-order-modal');

class PlaceOrderModal extends React.PureComponent<IProps> {

  public componentWillReceiveProps({ placeOrderCommunication }: IProps) {
    const {
      placeOrderCommunication: prevPlaceOrderCommunication,
    } = this.props;

    if (isSuccessedByState(prevPlaceOrderCommunication, placeOrderCommunication)) {
      this.handleCloseModal();
    }
  }

  public render() {
    const { placeOrderModal, currentCurrencyPair } = this.props;
    return (
      <Modal
        title="Place Order"
        isOpen={placeOrderModal.isOpen}
        onClose={this.handleCloseModal}
        hasCloseCross
      >
        <div className={b()}>
          <SinglePlaceOrderForm
            currentCurrencyPair={currentCurrencyPair}
            singlePlaceOrderFormKind="modal"
          />
        </div>
      </Modal>
    );
  }

  @bind
  private handleCloseModal() {
    const { setPlaceOrderModal, setFormPriceUpdate, singlePlaceOrderForm: { orderSide } } = this.props;
    setPlaceOrderModal({ isOpen: false });
    setFormPriceUpdate({ formType: orderSide, isPriceUpdateEnabled: true });

  }
}

export { IProps, PlaceOrderModal };
export default (
  connect(mapState, mapDispatch)(
    i18nConnect(PlaceOrderModal),
  )
);
