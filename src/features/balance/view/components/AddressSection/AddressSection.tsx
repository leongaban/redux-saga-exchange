import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as  CopyToClipboard from 'react-copy-to-clipboard';

import { Button } from 'shared/view/elements';
import { actions as notificationActions } from 'services/notification';

import './AddressSection.scss';

const b = block('address-section');

interface IProps {
  label: string;
  copyButtonLabel: string;
  qrButtonLabel: string;
  data: string;
  setNotification: typeof notificationActions.setNotification;
  onShowQRCodeClick(payload: string): void;
}

class AddressSection extends React.Component<IProps> {
  public render() {
    const { label, data, copyButtonLabel, qrButtonLabel } = this.props;
    return (
      <section className={b()}>
        <div className={b('label')()}>
          {label}
        </div>
        <div className={b('field-and-button')()}>
          <div className={b('field')()}>
            {data}
          </div>
          <div className={b('button')()}>
            <CopyToClipboard text={data} onCopy={this.handleCopyToClipboard}>
              <Button color="blue">
                {copyButtonLabel}
              </Button>
            </CopyToClipboard>
          </div>
          <div className={b('button')()}>
            <Button color="blue" onClick={this.handleShowQRCodeClick}>
              {qrButtonLabel}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  @bind
  private handleShowQRCodeClick() {
    const { onShowQRCodeClick, data } = this.props;
    onShowQRCodeClick(data);
  }

  @bind
  private handleCopyToClipboard(text: string, result: boolean) {
    const { setNotification } = this.props;
    if (result) {
      setNotification({ kind: 'info', text: 'Text copied successfully' });
    } else {
      setNotification({ kind: 'error', text: 'Text was not copied. Please, try later' });
    }
  }
}

export default AddressSection;
