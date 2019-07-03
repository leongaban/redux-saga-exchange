import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as React from 'react';
import { IAppReduxState } from 'shared/types/app';
import { selectors, actions } from '../../../redux';
import { ClientDeviceType } from '../../../../../shared/types/ui';

interface IStateProps {
  clientDeviceType: ClientDeviceType;
}

interface IActionProps {
  loadUserConfig: typeof actions.loadUserConfig;
  loadCurrencyPairs: typeof actions.loadCurrencyPairs;
  loadAssetsInfo: typeof actions.loadAssetsInfo;
  mLoadConfig: typeof actions.mLoadConfig;
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    clientDeviceType: selectors.selectClientDeviceType(state),
  };
}

type IProps = IStateProps & IActionProps;

class ConfigProvider extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { clientDeviceType } = this.props;
    const rootClasses = document.documentElement.classList;
    rootClasses.add(`device_${clientDeviceType}`);
    const isAdminPanel = document.location.pathname.includes('admin');

    if (!isAdminPanel) {
      this.props.loadUserConfig();
    }
    this.props.loadCurrencyPairs();
    this.props.loadAssetsInfo();

    if (clientDeviceType === 'mobile') {
      this.props.mLoadConfig();
    }
  }

  public render() {
    return null;
  }
}

export default connect(mapState, mapDispatch)(ConfigProvider);
