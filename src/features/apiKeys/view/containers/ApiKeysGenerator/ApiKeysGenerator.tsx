import * as React from 'react';
import block from 'bem-cn';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { getFormValues } from 'redux-form';
import { bind } from 'decko';

import { Preloader, Button, Modal, Link } from 'shared/view/elements';
import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { LinedSection, ModalCancel } from 'shared/view/components';
import { IApiKey } from 'shared/types/models';
import { isSuccessedByState } from 'shared/helpers/redux';
import { actions as notificationActions } from 'services/notification';
import { ICommunication } from 'shared/types/redux';
import { ClientDeviceContext } from 'services/config';

import { SingleApiKey, AddNewKeyForm, SecretKeyPanel } from '../../components';
import { INewApiKeyForm } from '../../../namespace';
import { selectors, actions, reduxFormEntries } from '../../../redux';
import './ApiKeysGenerator.scss';

interface IState {
  isShownAddKeyForm: boolean;
  deletingKey: string | null;
}

interface IStateProps {
  apiKeysAreRequesting: boolean;
  addApiKeyCommunication: ICommunication;
  removeApiKeyIsRequesting: boolean;
  apiKeys: IApiKey[];
  newKeyValues?: INewApiKeyForm;
}

interface IDispatchProps {
  getApiKeys: typeof actions.getApiKeys;
  addApiKey: typeof actions.addApiKey;
  removeApiKey: typeof actions.removeApiKey;
  removeSecretKey: typeof actions.removeSecretKey;
  setNotification: typeof notificationActions.setNotification;
}

const { newApiKeyFormEntry: { name } } = reduxFormEntries;

type IProps = IStateProps & IDispatchProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    apiKeysAreRequesting: selectors.selectApiKeysAreRequesting(state),
    addApiKeyCommunication: selectors.selectAddApiKey(state),
    removeApiKeyIsRequesting: selectors.selectRemoveApiKeyIsRequesting(state),
    apiKeys: selectors.selectApiKeys(state),
    newKeyValues: getFormValues(name)(state) as INewApiKeyForm
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    getApiKeys: actions.getApiKeys,
    addApiKey: actions.addApiKey,
    removeApiKey: actions.removeApiKey,
    removeSecretKey: actions.removeSecretKey,
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

// tslint:disable-next-line:no-empty
const noop = () => { };

const b = block('api-key-generator');

class ApiKeysGenerator extends React.PureComponent<IProps, IState> {
  public state = {
    deletingKey: null,
    isShownAddKeyForm: false
  };

  public componentDidUpdate(prevProps: IProps) {
    if (isSuccessedByState(
      prevProps.addApiKeyCommunication,
      this.props.addApiKeyCommunication
    )) {
      this.hideAddKeyModal();
    }
  }

  public componentDidMount() {
    const { apiKeys, getApiKeys } = this.props;
    if (!apiKeys.length) {
      getApiKeys();
    }
  }

  public render() {
    return (
      <ClientDeviceContext.Consumer>
        {device => {
          const isDesktop = device === 'desktop';
          const modalWindowComponent = this.renderModal(isDesktop);

          if (!isDesktop && modalWindowComponent) {
            return modalWindowComponent;
          }

          return this.renderMainComponentBody(modalWindowComponent);
        }
      }
      </ClientDeviceContext.Consumer>
    );
  }

  private renderMainComponentBody(modalWindowComponent: JSX.Element | null) {
    const {
      translate: t,
      apiKeys,
      apiKeysAreRequesting,
      removeApiKeyIsRequesting,
    } = this.props;

    return (
      <section className={b()}>
        <Preloader isShow={removeApiKeyIsRequesting} position="fixed" />
        <LinedSection withBorder>
          <h2 className={b('title')()}>{t('API-KEYS:SETTINGS')}</h2>
          <p className={b('details')()}>
            {t('API-KEYS:BASIC-INFO')}
            <Link target="_blank" href={'https://github.com/tradeio/exchange-api-doc'}>
              {t('API-KEYS:VIEW-API-DOCS-LINK-LABEL')}
            </Link>
          </p>
        </LinedSection>
        <div className={b('button')()}>
          <Button
            onClick={this.showAddKeyModal}
            isShowPreloader={apiKeysAreRequesting}
            disabled={apiKeysAreRequesting}
          >
            {t('API-KEYS:ADD-KEY-MODAL-TITLE')}
          </Button>
        </div>
        <LinedSection>
          {apiKeysAreRequesting && <div className={b('loader')()}>
            <Preloader isShow={true} size={5} />
          </div>}
          <ul className={b('keys-list')()}>
            {apiKeys.map(apiKey => (
              <SingleApiKey
                key={apiKey.publicKey}
                details={apiKey}
                removeApiKey={this.showRemoveKeyModal}
              />
            ))}
          </ul>
          {(!apiKeysAreRequesting && apiKeys.length === 0) &&
            <p className={b('empty-list')()}>{t('API-KEYS:EMPTY-KEYS-LIST')}</p>}
        </LinedSection>
        {modalWindowComponent}
        {this.renderRemoveKeyModal()}
      </section>
    );
  }

  private renderModal(isDesktop: boolean) {
    return this.renderAddKeyModal(isDesktop) || this.renderSecretKeyModal(isDesktop);
  }

  private renderSecretKeyModal(isDesktop: boolean) {
    const { apiKeys, translate: t, setNotification } = this.props;
    const keyDetails = apiKeys.find(key => !!key.privateKey);

    if (keyDetails) {
      const component = (
        <SecretKeyPanel
          details={keyDetails}
          removeSecretKey={this.removeSecretKey}
          setNotification={setNotification}
        />
      );

      if (isDesktop) {
        return (
          <Modal
            isOpen={true}
            title={t('API-KEYS:LABEL-API-KEY')}
            onClose={noop}
          >
            {component}
          </Modal>
        );
      }
      return component;

    }
    return null;
  }

  @bind
  private addNewApiKey(data: INewApiKeyForm) {
    this.props.addApiKey(data);
  }

  @bind
  private showAddKeyModal() {
    this.setState({ isShownAddKeyForm: true });
  }

  @bind
  private hideAddKeyModal() {
    this.setState({ isShownAddKeyForm: false });
  }

  private renderAddKeyModal(isDesktop: boolean) {
    const {
      translate: t,
      newKeyValues,
      addApiKeyCommunication,
      apiKeys,
    } = this.props;

    if (this.state.isShownAddKeyForm) {
      const defaultKeyName = t(
        'API-KEYS:DEFAULT-KEY-NAME',
        { number: `${apiKeys.length + 1}` }
      );
      const component = (
        <React.Fragment>
          <AddNewKeyForm
            isShownPreloader={addApiKeyCommunication.isRequesting}
            formValues={newKeyValues}
            onSubmit={this.addNewApiKey}
            defaultKeyName={defaultKeyName}
          />
          <div className={b('button')()}>
            <Button type="button" color="black-white" onClick={this.hideAddKeyModal}>
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
        </React.Fragment>
      );

      if (isDesktop) {
        return (
          <Modal
            hasBotttomBorderAtHeader
            hasCloseCross
            isOpen={true}
            title={t('API-KEYS:ADD-KEY-MODAL-TITLE')}
            onClose={this.hideAddKeyModal}
          >
            {component}
          </Modal>
        );
      }
      return component;
    }
    return null;
  }

  @bind
  private removeSecretKey(publicKey: string) {
    this.props.removeSecretKey(publicKey);
  }

  @bind
  private removeApiKey(publicKey: string) {
    const { removeApiKey } = this.props;
    removeApiKey(publicKey);
  }

  @bind
  private showRemoveKeyModal(publicKey: string) {
    this.setState({ deletingKey: publicKey });
  }

  @bind
  private hideRemoveKeyModal() {
    this.setState({ deletingKey: null });
  }

  @bind
  private confirmDeleteKey() {
    const { deletingKey } = this.state;
    if (deletingKey) {
      this.removeApiKey(deletingKey);
      this.hideRemoveKeyModal();
    }
  }

  private renderRemoveKeyModal() {
    const { deletingKey } = this.state;
    if (deletingKey === null) {
      return null;
    }
    const { translate: t } = this.props;
    const modalText = t('API-KEYS:CONFIRM-DELETE-TEXT', { key: deletingKey });

    return (
      <ModalCancel
        isOpen={true}
        title={t('API-KEYS:CONFIRM-DELETE-TITLE')}
        modalText={modalText}
        onCancel={this.hideRemoveKeyModal}
        onConfirm={this.confirmDeleteKey}
      />
    );
  }
}

const translated = i18nConnect(ApiKeysGenerator);
const container = connect<IStateProps, IDispatchProps>(mapState, mapDispatch)(translated);

export default container;
