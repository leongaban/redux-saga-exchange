import * as React from 'react';
import block from 'bem-cn';
import { Button } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import './Footer.scss';

const b = block('profile-footer');

interface IProps {
  isDisabledButton?: boolean;
  onSaveButtonClick(): void;
}

class Footer extends React.PureComponent<IProps & ITranslateProps> {
  public render() {
    const { onSaveButtonClick, translate: t, isDisabledButton } = this.props;
    return (
      <div className={b()}>
      <span className={b('info-text')()}>
        {t('PROFILE:FOOTER:TEXT')}
      </span>
        <div className={b('button')()}>
          <Button
            size="large"
            color="green"
            onClick={onSaveButtonClick}
            disabled={isDisabledButton}
            isShowPreloader={isDisabledButton}
          >
            {t('SHARED:BUTTONS:SAVE')}
          </Button>
        </div>
      </div>
    );
  }
}

export default i18nConnect(Footer);
