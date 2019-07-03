import * as NS from '../../namespace';

export * from './data';
export * from './edit';

export function setDefaultDocumentTitle(): NS.ISetDefaultDocumentTitle {
  return { type: 'ORDER_BOOK:SET_DEFAULT_DOCUMENT_TITLE' };
}
