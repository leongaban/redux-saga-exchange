import block from 'bem-cn';
import * as React from 'react';
import QRCode from 'qrcode.react';

import { defaultSize } from './constants';
import './QrCode.scss';

const b = block('qrcode');

interface IProps {
  value: string;
  size?: number;
}

class QrCode extends React.PureComponent<IProps> {

  public render() {
    const { value, size } = this.props;

    return (
      <div className={b()} style={{ width: size || defaultSize, height: size || defaultSize }}>
        <QRCode value={value} size={size}/>
      </div>
    );
  }
}

export { IProps as ICaptchaProps };
export default QrCode;
