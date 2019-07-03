import * as NS from '../../namespace';

export function removeDocumentUrl(payload: string): NS.IRemoveDocumentUrl {
  return { type: 'USERS:REMOVE_DOCUMENT_URL', payload };
}

export function setDocumentComplete(documentId: string): NS.IGetDocumentSuccess {
  return {
    type: 'USER:GET_DOCUMENT_SUCCESS',
    payload: { id: documentId, isCompleted: true }
  };
}
