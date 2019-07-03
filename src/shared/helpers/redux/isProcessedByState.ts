import { ICommunication } from 'shared/types/redux';

export default function isProcessedByState<T>(prev: ICommunication<T>, next: ICommunication<T>): boolean {
  return prev.isRequesting && !next.isRequesting;
}
