import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import { Checkbox } from 'shared/view/elements';

import './TwoFactorNoticeItem.scss';

const b = block('two-factor-notice-item');

interface IProps {
  text: string;
  isChecked: boolean;
  onChange: (lineId: string, newValue: boolean) => void;
}

class NoticeItem extends React.Component<IProps> {
  public render() {
    const { text, isChecked } = this.props;
    return (
      <div className={b()}>
        <Checkbox label={text} onChange={this.handleChange} checked={isChecked} />
      </div>
    );
  }

  @bind
  private handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const { text, onChange } = this.props;
    onChange(text, ev.target.checked);
  }
}

export default NoticeItem;
