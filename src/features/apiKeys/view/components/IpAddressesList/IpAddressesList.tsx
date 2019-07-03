import * as React from 'react';
import block from 'bem-cn';
import { Field, WrappedFieldArrayProps } from 'redux-form';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { bind } from 'decko';

import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { Button } from 'shared/view/elements';
import { validateIPAddress } from 'shared/helpers/validators';

import './IpAddressesList.scss';

type IListItemProps = WrappedFieldArrayProps<string>;
const b = block('ip-addresses-list');

type IProps = IListItemProps & ITranslateProps;

class IpAddressesList extends React.PureComponent<IProps> {
  public render() {
    const { fields, translate: t } = this.props;

    return (
      <>
        {fields.length > 0 &&
          <p className={b('title')()}>
            {t('API-KEYS:IP-RESTRICTION-TITLE')}:
          </p>
        }
        <ul className={b()}>
          {fields.map((field, index) => (
            <li key={index} className={b('ip-input')()}>
              <Field<IInputFieldProps>
                name={field}
                type="text"
                validateOnBlur
                component={InputField}
                placeholder={t('API-KEYS:IP-PLACEHOLDER')}
                validate={[this.ipAddressValidator]}
              />
              <span className={b('btn')()}>
                <Button
                  type="button"
                  onClick={this.makeRemoveAddressButtonClickHandler(index)}
                  iconKind="trash"
                  color="red"
                />
              </span>
            </li>
          ))}
          <li className={b('btn-plus')()}>
            <Button
              type="button"
              onClick={this.handleAddAddressButtonClick}
              iconKind={fields.length > 0 ? 'plus' : undefined}
              color="blue"
            >
              <p className={b('btn-text', { 'with-icon': fields.length > 0 })()}>
                {t(fields.length === 0 ?
                  'API-KEYS:ENABLE-IP-RESTRICTION' :
                  'API-KEYS:ADD-IP-RESTRICTION'
                )}
              </p>
            </Button>
          </li>
        </ul>
      </>
    );
  }

  @bind
  private handleAddAddressButtonClick() {
    this.props.fields.push('');
  }
  private makeRemoveAddressButtonClickHandler(index: number) {
    return () => this.props.fields.remove(index);
  }

  @bind
  private ipAddressValidator(value: string) {
    const { translate: t } = this.props;
    if (value && !validateIPAddress(value)) {
      return t('API-KEYS:INVALID-IP');
    }
  }
}

export default i18nConnect(IpAddressesList);
