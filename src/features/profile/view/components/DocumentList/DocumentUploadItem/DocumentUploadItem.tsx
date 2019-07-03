import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { WrappedFieldProps } from 'redux-form';

import { Button } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { UploadInputField, IUploadInputFieldProps } from 'shared/view/redux-form';

import './DocumentUploadItem.scss';
import { ISingleDocument } from 'shared/types/models';

interface IProps extends IUploadInputFieldProps {
  immutableList?: boolean;
  disabled?: boolean;
  mode: 'create' | 'remove';
  onCreate?(value: File): void;
  onRemove?(type: number, value: string): void;
}

// TODO reuse code from features/users/view/components/DocumentItem
interface IFileInfo {
  name: string;
  extension: string;
}

const b = block('document-upload-item');

class DocumentUploadItem extends React.PureComponent<IProps & WrappedFieldProps & ITranslateProps> {
  public render() {
    const { mode } = this.props;
    return (
      <div className={b({ create: mode === 'create' })()}>
        {
          mode === 'create'
            ? this.renderCreateMode()
            : this.renderRemoveMode()
        }
      </div>
    );
  }

  private renderRemoveMode() {
    const { input, disabled, immutableList, onRemove } = this.props;
    const document = input.value;

    return (
      <React.Fragment>
        <div className={b('text')()}>
          <a className={b('download-link')()} href={document.url} download>
            {this.renderTextPart(document)}
          </a>
        </div>
        <div className={b('button')()}>
          {immutableList && onRemove && <Button
            iconKind="trash"
            type="button"
            color="red"
            disabled={disabled}
            onClick={this.handleRemoveItem}
          />}
        </div>
      </React.Fragment>
    );
  }

  @bind
  private renderCreateMode() {
    const { input, meta, translate: t, disabled } = this.props;
    return (
      <React.Fragment>
        <div className={b('text')()}>
          {
            input.value
              ? this.renderTextPart(input.value)
              : <span className={b('empty')()}>{t('PROFILE:DOCUMENT-UPLOAD-ITEM:UPLOAD-DOC-TITLE')}</span>
          }
          <UploadInputField
            input={input}
            meta={meta}
            accept=".jpeg,.jpg,.gif,.png,.pdf"
            onFileDrop={this.handleCreateItem}
            disabled={disabled}
          >
            <div className={b('button')()}>
              <Button
                iconKind="plus"
                type="button"
                color="blue"
                disabled={disabled}
              />
            </div>
          </UploadInputField>
        </div>
      </React.Fragment>
    );
  }

  @bind
  private renderTextPart(document: ISingleDocument) {
    const { extension } = this.getFileInfo(document.url);
    return (
      <div className={b('file')()}>
        <span className={b('file-extension')()}>{extension}</span>
        <span className={b('file-name')()}>{document.name}</span>
      </div>
    );
  }

  @bind
  private handleCreateItem(value: File[]) {
    const { input: { onChange }, onCreate } = this.props;
    if (onCreate) {
      onCreate(value[0]);
    }
    onChange('');
  }

  @bind
  private handleRemoveItem() {
    const { input: { value }, onRemove } = this.props;
    if (onRemove) {
      onRemove(value.type, value.id);
    }
  }

  @bind
  private getFileInfo(value: string): IFileInfo {
    const fileName = /^(?:.+\/)?(.+)\.(.+?)(?:[?].+)?$/.exec(value);
    if (fileName) {
      const { 1: name, 2: extension } = fileName;
      return { name, extension };
    }

    console.warn('unexpected file format', value);
    return { name: 'file', extension: '' };
  }
}

export { IProps as IDocumentUploadItemProps };
export default i18nConnect(DocumentUploadItem);
