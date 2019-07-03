import * as React from 'react';
import block from 'bem-cn';

import { IOperation } from 'shared/types/models';
import { transferIdPrefixes } from 'shared/constants';
import { getPaymentSystemName } from 'shared/constants/paymentSystems';

import './OperationCell.scss';

interface IProps {
  record: IOperation;
}

const b = block('operation-cell');

class OperationCell extends React.PureComponent<IProps> {
  // ugly workaround to get details about transaction payment system
  private static getParsedOperationValueBasedonTxID(txId: string, type: string) {
    const txIdElements: string[] = txId.split('-');
    let system: string;
    try {
      system = getPaymentSystemName(txIdElements[0]) || getPaymentSystemName(txIdElements[1]);
    } catch (error) {
      system = '';
    }

    return system ? `${type} ${type === 'withdrawal' ? 'into' : 'from'} ${system}` : type;
  }

  public render() {
    const { record: { type, id } } = this.props;
    const value = type === 'withdrawal' && id.includes(transferIdPrefixes.lp) ?
      'LP Contribution' :
      OperationCell.getParsedOperationValueBasedonTxID(id, type);

    return <span className={b({ operation: type })()}>{value}</span>;
  }
}

export default OperationCell;
