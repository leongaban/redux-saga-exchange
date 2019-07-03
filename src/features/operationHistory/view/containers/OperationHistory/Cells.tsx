import * as React from 'react';
import { IOperation } from 'shared/types/models';
import moment from 'services/moment';

export function renderConfirmationCell(record: IOperation) {
  if (record.type === 'deposit') {
    return <span>{`${record.confirmations}/${record.confirmationsRequired}`}</span>;
  }
  return '-';
}

export function renderDateCell(creationDate: string) {
  const date = moment.utc(creationDate).format('HH:mm:ss DD.MM');
  return <span>{date}</span>;
}
