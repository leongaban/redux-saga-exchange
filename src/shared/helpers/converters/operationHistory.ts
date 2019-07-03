
import { ITransfer, IOperation } from 'shared/types/models';

export function convertTransfer(data: ITransfer): IOperation {
  return {
    id: data.transferId,
    amount: data.amount,
    asset: data.asset,
    type: data.type,
    status: data.status,
    creationDate: data.date,
    confirmations: data.data.confirmations || 0,
    confirmationsRequired: data.data.confirmationsRequired || 0,
    transactionId: data.data.txId || '',
    link: data.data.link || '',
  };
}

export function convertTransfers(data: ITransfer[]): IOperation[] {
  return data.map(convertTransfer);
}
