import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { ICommunication } from 'shared/types/redux';
import { selectors as configSelectors } from 'services/config';
import { UITheme } from 'shared/types/ui';

import { selectors, actions } from '../../../redux';
import { IReduxState } from '../../../namespace';
import { SimplexDialog } from '../../components';

interface IStateProps {
  modals: IReduxState['ui']['modals'];
  loadDepositAddressCommunication: ICommunication;
  uiTheme: UITheme;
}

interface IActionProps {
  setModalProps: typeof actions.setModalProps;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    modals: selectors.selectModals(state),
    loadDepositAddressCommunication: selectors.selectCommunication(state, 'loadDepositAddress'),
    uiTheme: configSelectors.selectUITheme(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    ...actions,
  }, dispatch);
}

class MSimplexDialog extends React.PureComponent<IProps> {

  public render() {
    const {
      modals, translate: t, setModalProps, loadDepositAddressCommunication, uiTheme
    } = this.props;

    return (
      <SimplexDialog
        simplexModal={modals.simplex}
        depositModal={modals.depositCoins}
        setModalProps={setModalProps}
        translate={t}
        addressIsLoading={loadDepositAddressCommunication.isRequesting}
        uiTheme={uiTheme}
      />
    );
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      MSimplexDialog,
    ),
  )
);
