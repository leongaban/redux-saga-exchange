import * as React from 'react';
import { connect } from 'react-redux';
import { IAppReduxState } from 'shared/types/app';
import { selectLocaleStrings, selectCurrentLocale } from '../../redux/selectors';

interface IOwnProps {
  tKey: string;
}

interface IStateProps {
  strings: { [key: string]: string; };
}

function mapState(state: IAppReduxState): IStateProps {
  const locale = selectCurrentLocale(state);
  const strings = selectLocaleStrings(state, locale);

  return { strings };
}

type Props = IStateProps & IOwnProps;

function Translate({ tKey, strings }: Props) {
  return (
    <span>{strings[tKey] || tKey}</span>
  );
}

export { Translate };
export default connect<IStateProps, {}, IOwnProps>(mapState)(Translate);
