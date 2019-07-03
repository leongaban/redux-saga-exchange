import block from 'bem-cn';
import * as React from 'react';

import { Segments } from 'shared/view/elements';
import { ITab } from 'shared/types/ui';

const b = block('nav-segments');

interface IProps {
  activeKey: string;
  onLogin(): void;
  onRegister(): void;
}

class NavSegments extends React.PureComponent<IProps> {

  public render() {
    const { onLogin, onRegister, activeKey } = this.props;
    const segments: ITab[] = [{
      title: 'Login',
      key: 'login',
      active: activeKey === 'login',
      onClick: onLogin,
    }, {
      title: 'Register',
      key: 'register',
      active: activeKey === 'register',
      onClick: onRegister,
    }];

    return (
      <div className={b()}>
        <Segments
          size="large"
          segments={segments}
        />
      </div>
    );
  }

}

export default NavSegments;
