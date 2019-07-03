import * as React from 'react';
import block from 'bem-cn';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Button, Modal, Preloader } from 'shared/view/elements';
import { checkForMessageCompletedEvent } from 'shared/helpers/common';
import { bind } from 'decko';
import './PandaDocModal.scss';

interface IProps {
  isOpen: boolean;
  url?: string;
  onComplete(): void;
  onCancel(): void;
}

const b = block('panda-doc-modal');
const eventName = 'message';

class PandaDocModal extends React.PureComponent<IProps & ITranslateProps> {

  public componentDidMount() {
    window.addEventListener(eventName, this.handlePandaEvent);
  }

  public componentWillUnmount() {
    window.removeEventListener(eventName, this.handlePandaEvent);
  }

  public render() {
    const { isOpen, url, onCancel, translate: t } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        title={t('LIQUIDITYPOOL:TIO-LOCKUP:DOCUMENT-TITLE')}
        onClose={onCancel}
      >
        <Preloader isShow={!url} />
        <div className={b()}>
          <div>
            <iframe src={url} className={b('iframe')()} />
            </div>
        </div>
        <div className={b('button')()}>
          <Button onClick={onCancel} size="large" color="black-white">
            {t('SHARED:BUTTONS:CANCEL')}
          </Button>
        </div>
      </Modal>
    );
  }

  @bind
  private handlePandaEvent(e: MessageEvent) {
    if (e && e.data) {
      try {
        const message = JSON.parse(e.data);
        const isCompletedEvent = message &&
          message.event &&
          checkForMessageCompletedEvent(message.event);

        if (isCompletedEvent) {
          this.props.onComplete();
        }
      } catch (e) {
        // TODO: comment it before merge
        // console.error(e);
      }
    }
  }
}

export default i18nConnect(PandaDocModal);
