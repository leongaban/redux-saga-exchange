import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import DocumentViewer from '../DocumentViewer/DocumentViewer';
import { Modal, Button, Preloader } from 'shared/view/elements';
import { ISingleDocument } from 'shared/types/models';

import './DocumentItem.scss';

interface IProps {
  document: ISingleDocument;
  isRequesting: boolean;
  onReset?(documentId: string): void;
}

interface IState {
  isOpen: boolean;
}

interface IFileInfo {
  name: string;
  extension: string;
}

const b = block('document-item');

class DocumentItem extends React.PureComponent<IProps, IState> {

  public state: IState = {
    isOpen: false,
  };

  public render() {
    const { document, onReset, isRequesting } = this.props;
    const { name, extension } = this.getFileInfo(document.url);
    const isPdfFile = extension.toLowerCase() === 'pdf';

    return (
      <div className={b()}>
        <div className={b('name')()} onClick={this.handleNameFileClick}>
          {this.renderTextPart(document)}
        </div>
        {onReset && <div className={b('button')()}>
          {
            isRequesting ?
              <Preloader isShow={true} type="button" position="relative" size={1} /> :
              <Button
                iconKind="trash"
                type="button"
                color="red"
                onClick={this.onResetClick}
              />
          }
        </div>}
        <Modal
          isOpen={this.state.isOpen}
          title={name}
          onClose={this.handleModalClose}
          hasCloseCross
          withVerticalScroll
        >
          <div className={b('document-viewer')()}>
            <DocumentViewer document={document.url} isPdfFile={isPdfFile} />
          </div>
        </Modal>
      </div>
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
  private onResetClick() {
    if (this.props.onReset) {
      this.props.onReset(this.props.document.id);
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

  @bind
  private handleNameFileClick() {
    this.setState({ isOpen: true });
  }

  @bind
  private handleModalClose() {
    this.setState({ isOpen: false });
  }
}

export default DocumentItem;
