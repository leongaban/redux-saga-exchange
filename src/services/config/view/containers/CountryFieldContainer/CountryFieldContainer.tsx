import { connect } from 'react-redux';
import { CountryField } from '../../components';
import { ICountry } from 'shared/types/models';
import { actions, selectors } from '../../../redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IAppReduxState } from 'shared/types/app';

interface IStateProps {
  countries: ICountry[];
}

interface IActionProps {
  loadCountries(filter?: string): void;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    countries: selectors.selectCounties(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(CountryField);
