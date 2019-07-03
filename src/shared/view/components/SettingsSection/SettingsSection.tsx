import * as React from 'react';
import block from 'bem-cn';

import './SettingsSection.scss';

interface IProps {
  title: string;
  isHigher?: boolean;
}

const b = block('settings-section');

class SettingsSection extends React.PureComponent<IProps> {
  public render() {
    const { title, isHigher, children } = this.props;
    return (
      <section className={b({ higher: Boolean(isHigher) })()}>
        <div className={b('title')()}>
          {title}
        </div>
        {children}
      </section>
    );
  }
}

export default SettingsSection;
