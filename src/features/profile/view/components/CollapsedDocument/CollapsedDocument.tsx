import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import './CollapsedDocument.scss';
import { IKycDocument } from 'shared/types/models/user';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import PreLoader from 'shared/view/elements/Preloader/Preloader';
import { LinedSection } from 'shared/view/components';
import { checkForMessageCompletedEvent } from 'shared/helpers/common';
import DocumentViewer from 'features/users/view/components/DocumentViewer/DocumentViewer';

interface IState {
  isOpen: boolean;
  showGenerateInfo: boolean;
}

interface IOwnProps {
  setDocumentComplete(documentId: string): void;
  removeDocumentUrl(id: string): void;
}

type IProps = IKycDocument & ITranslateProps & IOwnProps;

const b = block('collapsed-document');

class CollapsedDocument extends React.PureComponent<IProps, IState> {
  public eventWasAdded = false;
  public state: IState = {
    isOpen: false,
    showGenerateInfo: false,
  };

  public componentDidUpdate(prevProps: IProps) {
    const { isCompleted, url } = prevProps;
    if (!isCompleted && url && !this.eventWasAdded) {
      window.addEventListener('message', this.handleDocumentComplete);
      this.eventWasAdded = true;
    }
    if (!url && this.props.url && !this.state.isOpen) {
      this.toggleOpen();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.handleDocumentComplete);
    if (this.props.isCompleted && this.eventWasAdded) {
      this.props.removeDocumentUrl(this.props.id);
    }
  }

  public componentDidMount() {
    if (!this.props.isCompleted) {
      setTimeout(() => this.setState({ showGenerateInfo: true }), 5000);
    }
  }

  public render() {
    const { name, url } = this.props;

    return (
      <LinedSection withBorder>
        <div className={b()}>
          <h6
            className={b('title')()}
            onClick={this.toggleOpen}
          >
            {name}
            <p className={b('document-status')()}>{this.getCurrentStatus()}</p>
            <div className={b('expand-btn', { rotate: this.state.isOpen })()}>
              <PreLoader isShow={!url} type="button" position="relative" size={1} />
              {url && <i className="glyphicon glyphicon-chevron-down" />}
            </div>
          </h6>
          <div className={b('wrapper')()}>
            <div>
              {url && this.getDocumentNode()}
            </div>
          </div>
        </div>
      </LinedSection>
    );
  }

  private getCurrentStatus() {
    const { url, isCompleted, translate: t } = this.props;
    const { showGenerateInfo } = this.state;

    if (!url) {
      return showGenerateInfo ?
        t('PROFILE:AVATAR-UPLOAD-DROPZONE:GENERATE-DOC-INFO') :
        t('PROFILE:PERSONAL-DATA-FORM:FETCHING');
    } else if (isCompleted) {
      return t('PROFILE:PERSONAL-DATA-FORM:SIGNED');
    }
    return t('PROFILE:PERSONAL-DATA-FORM:UNSIGNED');
  }

  private getDocumentNode() {
    const { url, isCompleted } = this.props;
    if (isCompleted && !this.eventWasAdded) {
      return (
        <section className={b('document', { open: this.state.isOpen })()}>
          <DocumentViewer document={url} isPdfFile={true} />
        </section>
      );
    } else {
      return (
        <iframe
          src={url}
          className={b('document', {
            open: this.state.isOpen,
            form: true
          })()}
        />
      );
    }
  }

  @bind
  private toggleOpen() {
    if (this.props.url) {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }

  @bind
  private handleDocumentComplete(e: MessageEvent) {
    if (e && e.data) {
      const { url, id, setDocumentComplete } = this.props;
      try {
        const message = JSON.parse(e.data);
        const isCompletedEvent = message &&
          message.event &&
          checkForMessageCompletedEvent(message.event);
        const documentIsActive = document.activeElement &&
          document.activeElement.src === url;

        if (isCompletedEvent && documentIsActive) {
          setDocumentComplete(id);
        }
      } catch (e) {
        // NOTE: window generate many message events
        // console.error(e);
      }
    }
  }
}
export default i18nConnect(CollapsedDocument);
