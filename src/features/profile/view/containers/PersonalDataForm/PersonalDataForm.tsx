import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Field, reduxForm, InjectedFormProps, submit, change } from 'redux-form';

import { IAppReduxState } from 'shared/types/app';
import { InputControl, Icon, Modal, ProgressBar } from 'shared/view/elements';
import {
  InputField, IInputFieldProps,
  UploadInputField, IUploadInputFieldProps
} from 'shared/view/redux-form';
import {
  validateEmail,
  required,
  maxLength,
  validateAlphanumeric,
} from 'shared/helpers/validators';
import { IImageFile, IUser, IPersonalDataForm, IDocuments, IKycDocument } from 'shared/types/models';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { CountryField, selectors as configSelectors } from 'services/config';
import { ClientDeviceType } from 'shared/types/ui';
import { actions as notificationActions } from 'services/notification';
import { ACCOUNT } from 'shared/constants';

import { reduxFormEntries, selectors, actions } from './../../../redux';
import {
  AvatarUploadDropzone,
  DocumentsTypesList,
  Footer,
  AvatarCropper,
  IDocumentsTypesListProps,
  AccountTypeControl
} from '../../components';
import { LinedSection } from 'shared/view/components';
import CollapsedDocument from '../../components/CollapsedDocument/CollapsedDocument';
import * as NS from '../../../namespace';
import './PersonalDataForm.scss';

interface IStateProps {
  user: IUser | null;
  cropModalState: NS.ICroppAvaratModal;
  uploadProgress: number;
  isShowButtonPreloader: boolean;
  isUploadingDocument: boolean;
  isRemoveDocumentDisabled: boolean;
  isImageUploading: boolean;
  clientDeviceType: ClientDeviceType;
}

interface IDispatchProps {
  savePersonalInfo: typeof actions.savePersonalInfo;
  setCroppAvatarModalState: typeof actions.setCroppAvatarModalState;
  uploadImage: typeof actions.uploadImage;
  uploadDocument: typeof actions.uploadDocument;
  removeDocument: typeof actions.removeDocument;
  submitForm: typeof submit;
  setNotification: typeof notificationActions.setNotification;
  setDocumentComplete: typeof userActions.setDocumentComplete;
  removeDocumentUrl: typeof userActions.removeDocumentUrl;
  fetchDocuments: typeof userActions.fetchDocuments;
  getDocument: typeof userActions.getDocument;
  changeFieldValue(field: string, value: any): void;
}

type IProps = IStateProps & IDispatchProps & ITranslateProps
  & InjectedFormProps<IPersonalDataForm, {}>;

interface IState {
  selectedAccountType: ACCOUNT;
}

const { personalDataFormEntry: { fieldNames, name } } = reduxFormEntries;

function mapState(state: IAppReduxState): IStateProps {
  return {
    cropModalState: selectors.selectCroppAvatarModalState(state),
    user: userSelectors.selectUser(state),
    uploadProgress: selectors.selectUploadProgress(state),
    clientDeviceType: configSelectors.selectClientDeviceType(state),
    isShowButtonPreloader: selectors.selectCommunication(state, 'savePersonalInfo').isRequesting,
    isUploadingDocument: selectors.selectCommunication(state, 'uploadDocument').isRequesting,
    isRemoveDocumentDisabled: selectors.selectCommunication(state, 'removeDocument').isRequesting,
    isImageUploading: selectors.selectCommunication(state, 'uploadImage').isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  const bindedActions = bindActionCreators({
    savePersonalInfo: actions.savePersonalInfo,
    setCroppAvatarModalState: actions.setCroppAvatarModalState,
    uploadImage: actions.uploadImage,
    uploadDocument: actions.uploadDocument,
    removeDocument: actions.removeDocument,
    submitForm: submit,
    setNotification: notificationActions.setNotification,
    setDocumentComplete: userActions.setDocumentComplete,
    removeDocumentUrl: userActions.removeDocumentUrl,
    fetchDocuments: userActions.fetchDocuments,
    getDocument: userActions.getDocument,
  }, dispatch);
  const changeFieldValue = (field: string, value: any) => {
    dispatch(change(name, field, value));
  };
  return {
    ...bindedActions,
    changeFieldValue
  };
}

const validateMaxLength = maxLength(25);

const b = block('personal-data-form');

class PersonalDataForm extends React.PureComponent<IProps, IState> {
  public state: IState = {
    selectedAccountType: ACCOUNT.INDIVIDUAL
  };

  public componentDidMount() {
    const { initialize, user, fetchDocuments, changeFieldValue } = this.props;
    if (user) {
      initialize({
        email: user.email,
        nickname: user.nickname,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        address: user.address,
        city: user.city,
        country: user.country ? user.country : undefined,
        documents: {},
        postCode: user.postCode,
      });

      fetchDocuments(
        (kycDocuments: IKycDocument[], documents: IDocuments) => {
          changeFieldValue(fieldNames.documents, documents);
          const changeToBusiness = kycDocuments.some(document =>
            document.type === ACCOUNT.BUSINESS && document.isCompleted);
          this.changeAccountType(
            changeToBusiness ? ACCOUNT.BUSINESS : ACCOUNT.INDIVIDUAL,
            kycDocuments
          );
        }
      );
    }
  }

  public render() {
    const {
      translate: t, uploadDocument, removeDocument, user, isShowButtonPreloader,
      isUploadingDocument, uploadProgress, isRemoveDocumentDisabled, clientDeviceType,
      setDocumentComplete, removeDocumentUrl
    } = this.props;
    const userIsVerified = !!user && user.isVerified;
    const { selectedAccountType } = this.state;

    return (
      <React.Fragment>
        {this.renderCroppAvatarModal()}
        <div className={b()}>
          <form className={b('content')()} noValidate>
            <AvatarUploadDropzone onAvatarImageDrop={this.handleFileDrop}>
              <LinedSection withBorder>
                <div className={b('row')()}>
                  <div className={b('avatar-row')()}>
                    {this.renderAvatarField()}
                    <div className={b('avatar-text')()} >
                      <div className={b('avatar-title')()}>{t('PROFILE:PERSONAL-DATA-FORM:UPLOAD-PHOTO-TITLE')}</div>
                      <div className={b('avatar-hint')()}>
                        {
                          clientDeviceType === 'desktop'
                            ? t('PROFILE:PERSONAL-DATA-FORM:UPLOAD-PHOTO-HINT')
                            : t('PROFILE:PERSONAL-DATA-FORM:MOBILE-UPLOAD-PHOTO-HINT')
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className={b('row')()}>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:EMAIL-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.email}
                        type="email"
                        readOnly
                        validate={[required, validateEmail]}
                      />
                    </InputControl>
                  </div>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:NICKNAME-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.nickname}
                        validate={[
                          required,
                          validateMaxLength,
                          validateAlphanumeric
                        ]}
                      />
                    </InputControl>
                  </div>
                </div>
              </LinedSection>

              <LinedSection withBorder>
                <div className={b('row')()}>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:FIRST-NAME-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.firstName}
                        validate={[required, validateMaxLength]}
                      />
                    </InputControl>
                  </div>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:MIDDLE-NAME-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.middleName}
                        validate={[validateMaxLength]}
                      />
                    </InputControl>
                  </div>
                </div>
                <div className={b('row')()}>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:LAST-NAME-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.lastName}
                        validate={[required, validateMaxLength]}
                      />
                    </InputControl>
                  </div>
                </div>
              </LinedSection>

              {/* address fields */}
              <LinedSection withBorder>
                <div className={b('row')()}>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:ADDRESS-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.address}
                        validate={[required]}
                      />
                    </InputControl>
                  </div>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:CITY-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.city}
                        validate={[required]}
                      />
                    </InputControl>
                  </div>
                </div>
                <div className={b('row')()}>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:COUNTRY-INPUT-LABEL')}>
                      <Field<{}>
                        component={CountryField}
                        name={fieldNames.country!}
                        validate={[required]}
                      />
                    </InputControl>
                  </div>
                  <div className={b('row-item')()}>
                    <InputControl label={t('SHARED:POSTCODE-INPUT-LABEL')}>
                      <Field<IInputFieldProps>
                        component={InputField}
                        name={fieldNames.postCode}
                      />
                    </InputControl>
                  </div>
                </div>
              </LinedSection>
            </AvatarUploadDropzone>
          </form>

          {!userIsVerified && this.kycWasNotSubmit() &&
            user && user.kycDocuments.length > 0 &&
            <AccountTypeControl
              value={selectedAccountType}
              onChange={this.makeAccountTypeChangeHandler}
            />
          }

          {!userIsVerified && user && user.kycDocuments.map(document =>
            document.type === selectedAccountType ?
              (<CollapsedDocument
                key={document.id}
                {...document}
                setDocumentComplete={setDocumentComplete}
                removeDocumentUrl={removeDocumentUrl}
              />) :
              null
          )}

          {user && user.isVerified &&
            <LinedSection withBorder>
              <div className={b('user-verified')()}>
                <Icon
                  src={require('./images/verified-protection-inline.svg')}
                  className={b('verified-icon')()}
                />
                <span className={b('instruction')()}>
                  {t('PROFILE:PERSONAL-DATA-FORM:INFO-USER-VERIFIED')}
                </span>
              </div>
            </LinedSection>
          }

          <LinedSection
            title={t('PROFILE:PERSONAL-DATA-FORM:DOCUMENTS-SECTION-TITLE')}
            withBorder={userIsVerified}
          >
          {isUploadingDocument && <div className={b('progress-docs')()}>
            <ProgressBar percent={uploadProgress} />
          </div>}
          <div className={b('documents')()}>
            <Field<IDocumentsTypesListProps>
              name={fieldNames.documents}
              component={DocumentsTypesList}
              disableAddButton={isUploadingDocument}
              uploadDocument={uploadDocument}
              removeDocument={removeDocument}
              isRemoveDocumentDisabled={isRemoveDocumentDisabled}
              immutableList={!userIsVerified}
            />
          </div>
          </LinedSection>

          <p className={b('instruction')()}>
            {t('PROFILE:PERSONAL-DATA-FORM:INSTRUCTION')}
          </p>

          <Footer
            isDisabledButton={isShowButtonPreloader}
            onSaveButtonClick={this.handleSaveButtonClick}
          />
        </div>
      </React.Fragment>
    );
  }

  private kycWasNotSubmit() {
    const { user } = this.props;
    return user && user.kycDocuments.every(document => !document.isCompleted);
  }

  @bind
  private changeAccountType(value: ACCOUNT, kycDocuments?: IKycDocument[]) {
    const { user, getDocument } = this.props;
    this.setState({ selectedAccountType: value });
    getDocument({
      documents: kycDocuments ? kycDocuments : user!.kycDocuments,
      currType: value
    });
  }

  @bind
  private makeAccountTypeChangeHandler(value: ACCOUNT) {
    return () => this.changeAccountType(value);
  }

  @bind
  private renderCroppAvatarModal() {
    const { cropModalState: { isOpen, image } } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        title="choose crop image"
        onClose={this.handleCloseModal}
      >
        <div className={b('avatar-cropper')()}>
          {image && image.preview &&
            <AvatarCropper
              image={image}
              alt="Avatar"
              onConfirmButtonClick={this.handleImageCrop}
              onCancelButtonClick={this.handleCloseModal}
            />
          }
        </div>
      </Modal>
    );
  }

  @bind
  private renderAvatarField() {
    const { uploadProgress, isImageUploading, user } = this.props;
    const avatarPreview = user && user.avatarUrl
      ? <img className={b('avatar-preview')()} src={user.avatarUrl} />
      : <Icon className={b('avatar-icon')()} src={require('./images/black-camera-inline.svg')} />;
    return (
      <div className={b('avatar-field')()}>
        {
          isImageUploading
            ? (
              <div className={b('progress')()}>
                <ProgressBar percent={uploadProgress} />
              </div>
            ) : avatarPreview
        }
        <Field<IUploadInputFieldProps>
          component={UploadInputField}
          name={fieldNames.avatar}
          accept="image/*"
          onFileDrop={this.handleFileDrop}
        />
      </div>
    );
  }

  @bind
  private handleImageCrop(file: IImageFile) {
    this.props.setCroppAvatarModalState({
      image: undefined,
      isOpen: false,
    });
    this.props.uploadImage(file);
  }

  @bind
  private handleFileDrop(files: IImageFile[] | IImageFile, rejectedFiles?: IImageFile[]) {
    const { setCroppAvatarModalState, setNotification, translate: t } = this.props;
    if (rejectedFiles && rejectedFiles.length) {
      setNotification({
        kind: 'error',
        text: t('PROFILE:AVATAR-UPLOAD-DROPZONE:UNSUPPORTED-FILE-FORMAT'),
      });
    } else {
      setCroppAvatarModalState({
        isOpen: true,
        image: Array.isArray(files) ? files[0] : files,
      });
    }
  }

  @bind
  private handleCloseModal() {
    this.props.setCroppAvatarModalState({
      isOpen: false,
      image: undefined,
    });
  }

  @bind
  private handleSaveButtonClick() {
    const { submitForm } = this.props;
    submitForm(name);
  }
}

const translated = i18nConnect(PersonalDataForm);
const container = connect<IStateProps, IDispatchProps>(mapState, mapDispatch)(translated);
const formed = reduxForm<IPersonalDataForm, {}>({
  form: name,
  onSubmit: (formValues, dispatch, props) => {
    dispatch(actions.savePersonalInfo(formValues as IPersonalDataForm));
  }
})(container);

export { PersonalDataForm };
export default formed;
