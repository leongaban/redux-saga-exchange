import * as React from 'react';
import { connect } from 'react-redux';

import { UITheme } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';

import { selectors } from '../../../redux';

interface IStateProps {
  uiTheme: UITheme;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    uiTheme: selectors.selectUITheme(state),
  };
}

type IProps = IStateProps;

class ThemeProvider extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { uiTheme } = this.props;
    document.body.className = `theme_${uiTheme}`;
    // add theme class to html element also
    document.documentElement.className = `theme_${uiTheme}`;
  }

  public componentDidUpdate({ uiTheme: prevUiTheme }: IProps) {
    const { uiTheme } = this.props;
    if (uiTheme !== prevUiTheme) {
      const bodyClasses = document.body.classList;
      const htmlClasses = document.documentElement.classList;
      bodyClasses.remove(`theme_${prevUiTheme}`);
      bodyClasses.add(`theme_${uiTheme}`);
      htmlClasses.remove(`theme_${prevUiTheme}`);
      htmlClasses.add(`theme_${uiTheme}`);

      // force redraw to change scrollbar styling based on theme
      document.documentElement.style.display = 'none';
      document.documentElement.offsetHeight;
      document.documentElement.style.display = '';
    }
  }

  public render() {
    return null;
  }
}

export default connect(mapState)(ThemeProvider);
