import * as React from 'react';
import block from 'bem-cn';
import { ITab } from 'shared/types/ui';

import './Tabs.scss';

interface IProps {
  tabs: ITab[];
}

const b = block('tabs');

class Tabs extends React.PureComponent<IProps> {

  public render() {
    const { tabs } = this.props;
    return (
      <div className={b()}>
        {
          tabs.map(({ active, onClick, title, disabled, hidden }, index) => (
            <div
              className={b('element', { active, disabled: !!disabled, hidden: !!hidden })()}
              key={index}
              onClick={!disabled ? onClick : void (0)}
            >
              {title}
            </div>
          ))}
      </div>
    );
  }

}

export default Tabs;
export { IProps as ITabsProps };
