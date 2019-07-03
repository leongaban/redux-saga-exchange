import * as React from 'react';
import block from 'bem-cn';

import { Modal, Button } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import './SaveChangesDialog.scss';

interface IOwnProps {
  isOpen: boolean;
  onClose(): void;
  onYesClick(): void;
  onNoClick(): void;
  onCancelClick(): void;
}

type IProps = IOwnProps & ITranslateProps;

const b = block('save-changes-dialog');

class SaveChangesDialog extends React.PureComponent<IProps> {

  public render() {
    const { isOpen, onClose, onYesClick, onNoClick, onCancelClick, translate: t } = this.props;

    return (
      <Modal
        title={t('WIDGETS:SAVE-CHANGES-DIALOG:TITLE')}
        isOpen={isOpen}
        onClose={onClose}
        hasCloseCross
      >
        <div className={b()}>
          <div className={b('message')()}>
            {t('WIDGETS:SAVE-CHANGES-DIALOG:DESCRIPTION')}
          </div>
          <div className={b('btn')()}>
            <Button onClick={onYesClick}>
              {t('SHARED:BUTTONS:YES')}
            </Button>
          </div>
          <div className={b('btn')()}>
            <Button color="red" onClick={onNoClick}>
              {t('SHARED:BUTTONS:NO')}
            </Button>
          </div>
          <div className={b('btn')()}>
            <Button color="black-white" onClick={onCancelClick}>
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default i18nConnect(SaveChangesDialog);
