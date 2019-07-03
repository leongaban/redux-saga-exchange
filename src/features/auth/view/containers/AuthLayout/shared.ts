import { IAppReduxState } from 'shared/types/app';
import { selectors as userSelectors } from 'services/user/redux';

export interface IOwnProps {
  navSegmentsComponent?: JSX.Element;
  title?: string;
}

export interface IStateProps {
  disabled?: boolean;
}

export type IProps = IOwnProps & IStateProps;

export function mapState(state: IAppReduxState): IStateProps {
  return {
    disabled: userSelectors.selectSessionRestoring(state).isRequesting,
  };
}
