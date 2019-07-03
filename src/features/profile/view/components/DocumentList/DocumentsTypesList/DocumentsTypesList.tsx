import * as React from 'react';
import block from 'bem-cn';
import { FieldArray, WrappedFieldProps } from 'redux-form';

import DocumentList, { IDocumentListProps } from '../DocumentList/DocumentList';
import * as NS from '../../../../namespace';
import './DocumentsTypesList.scss';

const b = block('document-types-list');

interface IState {
  error: string;
}

interface IProps {
  disableAddButton?: boolean;
  isRemoveDocumentDisabled: boolean;
  immutableList: boolean;
  uploadDocument(arg: NS.IUploadDocumentPayload): void;
  removeDocument(arg: NS.IRemoveDocumentPayload): void;
}

class DocumentsTypesList extends React.PureComponent
<IProps & WrappedFieldProps, IState> {
  public render() {
    const {
      disableAddButton,
      isRemoveDocumentDisabled,
      immutableList,
      uploadDocument,
      removeDocument,
      input,
    } = this.props;
    const { value } = input;

    return (
      <ul className={b()}>
        {Object.keys(value).map((field, index) => (
          <li key={index} className={b('item')()}>
            <FieldArray<IDocumentListProps>
              name={`documents.${field}`}
              documentType={Number(field)}
              component={DocumentList}
              disableAddButton={disableAddButton}
              uploadDocument={uploadDocument}
              removeDocument={removeDocument}
              isRemoveDocumentDisabled={isRemoveDocumentDisabled}
              immutableList={immutableList}
            />
          </li>
        ))}
      </ul>
    );
  }
}

export { IProps as IDocumentsTypesListProps };
export default DocumentsTypesList;
