import * as React from 'react';
import block from 'bem-cn';

import { namespace as i18nNS } from 'services/i18n';
import { QrCode, Lightbox } from 'shared/view/components';

import './QRCodePopup.scss';

const b = block('qr-code-popup');

interface IProps {
  data: string;
  translate: i18nNS.TranslateFunction;
  onClose: () => void;
}

const QRCodePopup: React.SFC<IProps> = ({ data, onClose, translate: t }: IProps) => (
  <Lightbox clickAnywhere onClose={onClose}>
    <div className={b()}>
      <QrCode size={200} value={data} />
      <div className={b('info')()}>
        {t('BALANCE:QR-CODE-POPUP:INFO')}
      </div>
    </div>
  </Lightbox>
);

export default QRCodePopup;
