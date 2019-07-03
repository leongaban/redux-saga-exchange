import * as React from 'react';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import block from 'bem-cn';

import { Radio } from 'shared/view/elements';
import { ACCOUNT } from 'shared/constants';

import './AccountTypeControl.scss';

interface IOwnProps {
  value: ACCOUNT;
  onChange(value: ACCOUNT): () => void;
}
type IProps = IOwnProps & ITranslateProps;

const b = block('account-type-control');

const AccountTypeControl = ({ translate: t, value, onChange }: IProps) => {
  return (
    <div className={b()}>
      <h3 className={b('title')()}>{t('PROFILE:PERSONAL-DATA-FORM:CHOOSE-ACCOUNT-TYPE')}</h3>
      <div className={b('button')()}>
        <Radio
          name="market-name"
          label={t('PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE-INDIVIDUAL')}
          position="left"
          extent="small"
          checked={value === ACCOUNT.INDIVIDUAL}
          onChange={onChange(ACCOUNT.INDIVIDUAL)}
        />
      </div>
      <div className={b('button')()}>
        <Radio
          name="market-name"
          label={t('PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE-BUSINESS')}
          position="right"
          extent="small"
          checked={value === ACCOUNT.BUSINESS}
          onChange={onChange(ACCOUNT.BUSINESS)}
        />
      </div>
    </div>
  );
};

export default i18nConnect(AccountTypeControl);
