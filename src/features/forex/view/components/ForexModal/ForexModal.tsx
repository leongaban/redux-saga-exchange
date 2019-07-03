import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

import { ITranslateProps, i18nConnect } from 'services/i18n';
import { CountryField, ClientDeviceContext } from 'services/config';
import { Button, Modal, Checkbox, Radio, Input, InputControl, Link } from 'shared/view/elements';
import { required } from 'shared/helpers/validators';
import {
  IUser, ICountry, IForexAccount, IForexRegistrationForm,
  forexDocClient, forexDocExecution, forexDocLeverage, forexDocPrivacy, forexDocRisk
} from 'shared/types/models';

import './ForexModal.scss';

interface ILegalDocument {
  i18nKeyName: string;
  link: string;
}

const documents: ILegalDocument[] = [{
  i18nKeyName: 'FOREX:TM-CLIENT-AGREEMENT',
  link: forexDocClient,
}, {
  i18nKeyName: 'FOREX:TM-EXECUTION-POLICY',
  link: forexDocExecution,
}, {
  i18nKeyName: 'FOREX:TM-LEVERAGE-POLICY',
  link: forexDocLeverage,
}, {
  i18nKeyName: 'FOREX:TM-PRIVACY-POLICY',
  link: forexDocPrivacy,
}, {
  i18nKeyName: 'FOREX:TM-RISK-DISCLOSURE',
  link: forexDocRisk,
}];

interface IState {
  leverage: number;
  baseAsset: string;
  address: string;
  city: string;
  country: ICountry;
  postcode: string;
  terms: { [name: string]: boolean };
  formSubmitted: boolean;
}

interface IOwnProps {
  isOpen: boolean;
  user: IUser | null;
  onForexModalCancel(): void;
  onCreateAccount(account: IForexAccount): void;
}

type IProps = IOwnProps & ITranslateProps
  & InjectedFormProps<IForexRegistrationForm, IOwnProps>;

const b = block('forex-modal');

class ForexModal extends React.Component<IProps, IState> {
  private leverageItems = [
    { label: '1:1', amount: 1 },
    { label: '50:1', amount: 50 },
    { label: '100:1', amount: 100 },
    { label: '200:1', amount: 200 },
    { label: '300:1', amount: 300 },
    { label: '400:1', amount: 400 },
    { label: '500:1', amount: 500 }
  ];
  private baseAssets = ['TIOx', 'BTC', 'ETH'];

  constructor(props: IProps) {
    super(props);

    const { user } = props;
    let city = '';
    let address = '';
    let postcode = '';
    let country = {
      id: '',
      name: '',
      kyc: '',
      code: ''
    };

    if (user) {
      if (user.city) {
        city = user.city;
      }
      if (user.address) {
        address = user.address;
      }
      if (user.postCode) {
        postcode = user.postCode;
      }
      if (user.country) {
        country = user.country;
      }
    }

    this.state = {
      leverage: 1,
      baseAsset: 'TIOx',
      address,
      city,
      country,
      postcode,
      formSubmitted: false,
      terms: documents.reduce((prev, cur) => ({ ...prev, [cur.i18nKeyName]: false }), {}),
    };
  }

  public componentDidMount() {
    this.props.initialize({ country: this.state.country });
  }

  public render() {
    const { isOpen, translate: t } = this.props;
    return (
      <ClientDeviceContext.Consumer>
        {device => {
          const content = this.renderContent();
          if (device === 'desktop') {
            return (
              <Modal
                isOpen={isOpen}
                title={t('FOREX:MODAL:TITLE')}
              >
                {content}
              </Modal>
            );
          } else {
            return (
              <>
                <div className={b('title')()}>{t('FOREX:MODAL:TITLE')}</div>
                {content}
              </>
            );
          }
        }}
      </ClientDeviceContext.Consumer>
    );
  }

  @bind
  private renderContent() {
    const { onForexModalCancel, translate: t } = this.props;

    const {
      baseAsset, leverage,
      address, city, country, postcode, formSubmitted, terms,
    } = this.state;

    const isAllTermsChecked = Object.values(terms).every(Boolean);

    const enableSubmit = address && city && country && postcode && isAllTermsChecked;

    return (
      <div className={b('container')()}>
        <div className={b('forex-instructions')()}>
          <p className={b('field-title')()}>{t('FOREX:REGISTRATION:INTRUCTIONS')}</p>
        </div>

        <div className={b('row')()}>
          <div className={b('legal')()}>
            <div className={b('cell')()}>
              {
                documents.map(document => (
                  <div className={b('legal-document')()}>
                    <Checkbox
                      label={t('FOREX:I-ACCEPT')}
                      checked={terms[document.i18nKeyName]}
                      onChange={this.handleTermsDocumentCheck(document.i18nKeyName)}
                    />
                    <Link
                      className={b('legal-link')()}
                      href={document.link}
                      target="_blank"
                    >
                      {t(document.i18nKeyName)}
                    </Link>
                  </div>
                ))
              }
            </div>
            <div className={b('cell')()}>
              <div className={b('tio-markets-logo')()}>
                <img src={'./img/forex/PoweredByTIOMarkets.png'} />
              </div>
            </div>
          </div>
        </div>

        <div className={b('row')()}>
          <div className={b('cell')()}>
            <p className={b('field-title')()}>{t('FOREX:PLEASE-SELECT-LEVERAGE')}</p>
            <div className={b('tabs')()}>
              {this.leverageItems.map((leverageItem) => (
                <div className={b('tab')()} key={leverageItem.label}>
                  <Radio
                    label={leverageItem.label}
                    extent="small"
                    checked={leverage === leverageItem.amount}
                    onChange={this.handleSelectLeverage(leverageItem.amount)}
                  />
                </div>
              ))}
            </div>
            <p>&nbsp;</p>
          </div>
          <div className={b('cell-base-assets')()}>
            <p className={b('field-title')()}>{t('FOREX:PLEASE-SELECT-BASE-ASSET')}</p>
            <div className={b('tabs')()}>
              {this.baseAssets.map((asset) => (
                <div className={b('tab')()} key={asset}>
                  <Radio
                    label={asset}
                    extent="small"
                    checked={baseAsset === asset}
                    onChange={this.handleSelectBaseAsset(asset)}
                  />
                </div>
              ))}
            </div>
            <p className={b('commisions-info')()}>
              {baseAsset === 'TIOx' ? t('FOREX:COMMISIONS:4') : t('FOREX:COMMISIONS:8')}
            </p>
          </div>
        </div>

        <div className={b('row')()}>
          <p>{t('FOREX:AML-POLICY')}</p>

          <div className={b('row-item')()}>
            <label className={b('label')()} htmlFor={t('SHARED:ADDRESS-INPUT-LABEL')}>
              {t('SHARED:ADDRESS-INPUT-LABEL')}
            </label>
            <Input
              value={address}
              type="text"
              onChange={this.handleAddressChange}
            />
          </div>
          <div className={b('row-item')()}>
            <label className={b('label')()} htmlFor={t('SHARED:CITY-INPUT-LABEL')}>
              {t('SHARED:CITY-INPUT-LABEL')}
            </label>
            <Input
              value={city}
              type="text"
              onChange={this.handleCityChange}
            />
          </div>
          <div className={b('row-item')()}>
            <InputControl label={t('SHARED:COUNTRY-INPUT-LABEL')}>
              <Field<{}>
                component={CountryField}
                name={'country'}
                onChange={this.handleCountryChange}
                validate={[required]}
              />
            </InputControl>
          </div>
          <div className={b('row-item')()}>
            <label className={b('label')()} htmlFor={t('SHARED:POSTCODE-INPUT-LABEL')}>
              {t('SHARED:POSTCODE-INPUT-LABEL')}
            </label>
            <Input
              value={postcode}
              type="text"
              onChange={this.handlePostCodeChange}
            />
          </div>

          <div className={b('button-group')()}>
            <div className={b('button')()}>
              <Button
                onClick={this.handleSubmit}
                size="large"
                color="black-white"
                isShowPreloader={formSubmitted}
                disabled={!enableSubmit}
              >
                {t('SHARED:BUTTONS:SUBMIT')}
              </Button>
            </div>
            <div className={b('button')()}>
              <Button
                size="large"
                color="black-white"
                onClick={onForexModalCancel}
                isShowPreloader={formSubmitted}
              >
                {t('SHARED:BUTTONS:CANCEL')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @bind
  private handleSubmit() {
    const { user, onCreateAccount } = this.props;
    const { baseAsset, leverage, address, city, country, postcode } = this.state;

    let firstName;
    let lastName;
    let email;

    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    const req = {
      name: `${firstName} ${lastName}`,
      email,
      leverage,
      baseAsset,
      address: `${address}, ${city}, ${country ? country.name : ''}, ${postcode}`
    };

    this.setState({
      formSubmitted: true
    });

    onCreateAccount(req);
  }

  @bind
  private handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newAddress = (event.target.value);
    this.setState({
      address: newAddress
    });
  }

  @bind
  private handleCityChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newCity = (event.target.value);
    this.setState({
      city: newCity
    });
  }

  @bind
  private handleCountryChange(event: React.ChangeEvent<HTMLInputElement>) {
    // @ts-ignore: Event code error when event changes into Country object.
    const newCountry: ICountry = (event ? event : undefined);

    this.setState({
      country: newCountry
    });
  }

  @bind
  private handlePostCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();
    const newPostCode = (event.target.value);
    this.setState({
      postcode: newPostCode
    });
  }

  @bind
  private handleTermsDocumentCheck(i18nKeyName: string) {
    return () => {
      this.setState((prevState) => ({
        terms: {
          ...prevState.terms,
          [i18nKeyName]: !prevState.terms[i18nKeyName],
        }
      }));
    };
  }

  @bind
  private handleSelectLeverage(leverageAmount: number) {
    return () => this.setState({ leverage: leverageAmount });
  }

  @bind
  private handleSelectBaseAsset(baseAsset: string) {
    return () => this.setState({ baseAsset });
  }
}

const translated = i18nConnect(ForexModal);
const formed = reduxForm<IForexRegistrationForm, IOwnProps>({
  form: 'forex-modal'
})(translated);

export { ForexModal };
export default formed;
