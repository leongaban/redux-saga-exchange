import * as React from 'react';
import { Omit } from 'react-redux';
import { reduxForm, ConfigProps } from 'redux-form';

function multiReduxFormConnect<FormData = {}, P = {}>(
  config: Omit<ConfigProps<FormData, P>, 'form'>,
  selectFormName: (instanceKey: string) => string,
) {
  return (component: any) => {

    class MultiReduxFormConnector extends React.PureComponent<any> {
      private ConnectedReduxFormComponent: React.ComponentClass<any>;

      public componentWillMount() {
        const { instanceKey } = this.props;
        this.ConnectedReduxFormComponent = reduxForm({ ...config, form: selectFormName(instanceKey) })(component);
      }

      public render() {
        const ConnectedComponent = this.ConnectedReduxFormComponent;
        return <ConnectedComponent {...this.props} />;
      }
    }

    return MultiReduxFormConnector;
  };
}

export { multiReduxFormConnect };
