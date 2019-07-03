import * as React from 'react';
import block from 'bem-cn';

import { OperationStatus } from 'shared/types/models';
import { Tooltip, Link } from 'shared/view/elements';
import { TranslateFunction } from 'services/i18n/namespace';

import './StatusCell.scss';

interface IProps {
  status: OperationStatus;
  link?: string;
  translate: TranslateFunction;
}

const b = block('status-cell');

class StatusCell extends React.PureComponent<IProps> {
  public render() {
    const { status, link, translate: t } = this.props;

    const modifier = (() => {
      switch (status) {
        case 'complete':
        case 'funds-locked':
          return 'complete';
        case 'unknown':
        case 'canceled':
        case 'fail':
          return 'canceled';
        case 'awaiting-confirmation':
        case 'pending-cancellation':
        case 'pending':
          return 'in-progress';
        default:
          console.warn('unknown status', status);
          return 'in-progress';
      }
    })();

    const statusContent = <div className={b({ [modifier]: true })()}> {status} </div>;

    return link
      ? (
        <Tooltip text={t('OPERATION-HISTORY:TRANSACTION-LINK:READY')} position="bottom">
          <Link href={link} target="_blank" className={b('link')()}>
            {statusContent}
          </Link>
        </Tooltip>
      )
      : (
        <Tooltip text={t('OPERATION-HISTORY:TRANSACTION-LINK:NOT-READY')} position="bottom">
          {statusContent}
        </Tooltip>
      );
  }
}

export default StatusCell;
