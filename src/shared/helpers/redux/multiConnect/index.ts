import * as actions from './actions';
import { reducer } from './reducer';
import { multiConnect } from './multiConnect';
import { multiReducer } from './multiReducer';
import { multiReduxFormConnect } from './multiConnectReduxForm';

export { actions, reducer, multiConnect, multiReducer, multiReduxFormConnect };
export { IMultiAction, IMultiInstanceState, IMultiConnectProps } from './namespace';
