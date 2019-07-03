import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldArrayProps, Field } from 'redux-form';

import { Error } from 'shared/view/elements';
import { IImageFile } from 'shared/types/models';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { documentTypes, documentTypeNames } from 'services/user/constants';

import DocumentUploadItem, { IDocumentUploadItemProps } from '../DocumentUploadItem/DocumentUploadItem';
import * as NS from '../../../../namespace';
import './DocumentList.scss';

const b = block('document-list');

interface IState {
  error: string;
}

interface IOwnProps {
  documentType: number;
  disableAddButton?: boolean;
  isRemoveDocumentDisabled: boolean;
  immutableList: boolean;
  uploadDocument(arg: NS.IUploadDocumentPayload): void;
  removeDocument(arg: NS.IRemoveDocumentPayload): void;
}

type IProps = IOwnProps & WrappedFieldArrayProps<IImageFile> & ITranslateProps;

class DocumentList extends React.PureComponent<IProps, IState> {
  public state: IState = {
    error: '',
  };

  public render() {
    const {
      fields,
      disableAddButton,
      isRemoveDocumentDisabled,
      immutableList,
      translate: t,
      documentType,
    } = this.props;
    const { error } = this.state;
    const disableActions = disableAddButton || isRemoveDocumentDisabled;

    if (documentType === documentTypes.kycForm && fields.length === 0) {
      return null;
    }
    return (
      <div className={b()}>
        <div className={b('header')()}>
          <p className={b('title')()}>{t(documentTypeNames[documentType])}</p>
          {documentType !== documentTypes.kycForm &&
            <Field<IDocumentUploadItemProps>
              name="empty"
              mode="create"
              disabled={disableActions}
              onCreate={this.handleCreateNewDoc}
              component={DocumentUploadItem}
            />
          }
        </div>
        {
          fields.map((field, index) => (
            <Field<IDocumentUploadItemProps>
              key={index}
              mode="remove"
              name={field}
              component={DocumentUploadItem}
              disabled={disableActions}
              immutableList={immutableList}
              onRemove={documentType === documentTypes.kycForm ?
                undefined :
                this.makeRemoveDocHandler(index)}
            />
          ))
        }
      {error && <Error>{error}</Error>}
      {documentType === documentTypes.kycForm && fields.length > 0 && <p className={b('remove-info')()}>
        {t('PROFILE:AVATAR-UPLOAD-DROPZONE:CONTACT-WITH-ADMIN')}
      </p>}
      </div>
    );
  }

  @bind
  private handleCreateNewDoc(file: File) {
    const { uploadDocument, documentType, translate: t } = this.props;
    if (!file) {
      this.setState({ error: t('PROFILE:AVATAR-UPLOAD-DROPZONE:EXTENSION-ERROR') });
    } else if (file.size < 5242880) {
      uploadDocument({ file, type: documentType });
      this.setState({ error: '' });
    } else {
      this.setState({ error: t('PROFILE:AVATAR-UPLOAD-DROPZONE:SIZE-ERROR') });
    }
  }

  @bind
  private makeRemoveDocHandler(index: number) {
    const { removeDocument } = this.props;
    return (type: number, id: string) => {
      removeDocument({ index, id, type });
    };
  }
}

export { IOwnProps as IDocumentListProps };
export default i18nConnect(DocumentList);
