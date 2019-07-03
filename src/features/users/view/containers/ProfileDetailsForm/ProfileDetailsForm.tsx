import React from 'react';
import block from 'bem-cn';
import * as R from 'ramda';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps, Validator } from 'redux-form';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  ISelectFieldProps,
  SelectField,
  InputField,
  IInputFieldProps,
  ICheckboxFieldProps,
  CheckboxField,
} from 'shared/view/redux-form';
import { InputControl, Button } from 'shared/view/elements';
import moment from 'services/moment';
import { IAdminPanelUser, IUserRole, IClaim, AccountType, IUser } from 'shared/types/models';
import { CountryField } from 'services/config';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as userServiceSelectors } from 'services/user/redux';
import { validateEmail, required, maxLength } from 'shared/helpers/validators';
import { IAppReduxState } from 'shared/types/app';

import { getClaimTitle } from './constants';
import { actions, selectors, reduxFormEntries } from '../../../redux';
import * as NS from '../../../namespace';
import './ProfileDetailsForm.scss';

interface IOwnProps {
  currentProfile: IAdminPanelUser;
  onCancelButtonClick(): void;
}

interface IStateProps {
  userRoles: IUserRole[];
  loggedInUser: IUser | null;
  isUnlockUserRequesting: boolean;
  isConfirmEmailRequesting: boolean;
  isUpdateProfileRequesting: boolean;

}

interface IActionProps {
  unlockUser: typeof actions.unlockUser;
  confirmEmail: typeof actions.confirmEmail;
  deleteUserClaim: typeof actions.deleteUserClaim;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    userRoles: selectors.selectUserRoles(state),
    loggedInUser: userServiceSelectors.selectUser(state),
    isUnlockUserRequesting: selectors.selectCommunication(state, 'unlockUser').isRequesting,
    isConfirmEmailRequesting: selectors.selectCommunication(state, 'confirmEmail').isRequesting,
    isUpdateProfileRequesting: selectors.selectCommunication(state, 'updateProfile').isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    unlockUser: actions.unlockUser,
    confirmEmail: actions.confirmEmail,
    deleteUserClaim: actions.deleteUserClaim,
  }, dispatch);
}

const b = block('profile-details');

const { usersFormEntry: { name: formName, fieldNames } } = reduxFormEntries;
const validateMaxLength = maxLength(25);

const transAccountTypes = {
  [AccountType.notSet]: 'PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE-NOT-SET',
  [AccountType.individual]: 'PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE-INDIVIDUAL',
  [AccountType.business]: 'PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE-BUSINESS',
};

type IProps = IStateProps & IActionProps & IOwnProps & ITranslateProps & InjectedFormProps<NS.IUsersForm, IOwnProps>;

class ProfileDetailsForm extends React.PureComponent<IProps> {

  public componentDidMount() {
    this.initializeForm();
  }

  public render() {
    const { userRoles, translate: t, currentProfile } = this.props;
    return (
      <form onSubmit={this.props.handleSubmit} className={b()}>

        <div className={b('info')()}>
          <div className={b('section-left')()}>
            <InputControl label={t('SHARED:USER-ROLE-INPUT-LABEL')}>
              <Field<ISelectFieldProps<IUserRole>>
                component={SelectField}
                name={fieldNames.role}
                options={userRoles}
                optionValueKey={this.getOptionValue}
              />
            </InputControl>
            <p className={b('label')()}>
              <span>{t('PROFILE:PERSONAL-DATA-FORM:ACCOUNT-TYPE')}: </span>
              <span className={b('account-type')()}>{t(transAccountTypes[currentProfile.accountType])}</span>
            </p>
            {currentProfile.affiliateId && <p className={b('label')()}>
              {t('PROFILE:PERSONAL-DATA-FORM:AFFILIATE-ID')}: {currentProfile.affiliateId}
            </p>}
            {currentProfile.referralId && <p className={b('label')()}>
              {t('PROFILE:PERSONAL-DATA-FORM:REFERRAL-ID')}: {currentProfile.referralId}
            </p>}
            {this.renderCheckboxField('SHARED:TWO-FACTOR-ENABLED-CHECKBOX-LABEL', fieldNames.twoFactorEnabled)}
          </div>
          <div className={b('section-right')()}>
            {this.renderEmailConfirmationSection()}
            {this.renderUnlockSection()}
          </div>
        </div>

        <div className={b('info')()}>
          <div className={b('section-left')()}>
            {this.renderInputField('SHARED:EMAIL-INPUT-LABEL', fieldNames.email, [required, validateEmail])}
          </div>
          <div className={b('section-right')()}>
            {this.renderInputField('SHARED:NICKNAME-INPUT-LABEL', fieldNames.nickname, [required, validateMaxLength])}
          </div>
        </div>

        <div className={b('info')()}>
          <div className={b('section-left')()}>
            {this.renderInputField(
              'SHARED:FIRST-NAME-INPUT-LABEL',
              fieldNames.firstName,
              [required, validateMaxLength]
            )}
            {this.renderInputField(
              'SHARED:LAST-NAME-INPUT-LABEL',
              fieldNames.lastName,
              [required, validateMaxLength],
            )}
          </div>
          <div className={b('section-right')()}>
            {this.renderInputField('SHARED:MIDDLE-NAME-INPUT-LABEL', fieldNames.middleName, [validateMaxLength])}
            <InputControl label={t('SHARED:COUNTRY-INPUT-LABEL')}>
              <Field
                component={CountryField}
                name={fieldNames.country}
              />
            </InputControl>
          </div>
        </div>

        {this.renderClaimsSection(currentProfile)}

        {this.renderControls()}

      </form>
    );
  }

  @bind
  private getOptionValue(x: IUserRole) {
    return x.name;
  }

  @bind
  private renderCheckboxField(
    i18nKeyLabel: string,
    name: string,
  ) {
    return (
      <div className={b('checkbox-wrapper')()}>
        <Field<ICheckboxFieldProps>
          component={CheckboxField}
          name={name}
          label={this.props.translate(i18nKeyLabel)}
        />
      </div>
    );
  }

  @bind
  private renderInputField(
    i18nKeyLabel: string,
    name: string,
    validators: Validator[],
  ) {
    return (
      <InputControl label={this.props.translate(i18nKeyLabel)}>
        <Field<IInputFieldProps>
          component={InputField}
          name={name}
          validate={validators}
        />
      </InputControl>
    );
  }

  @bind
  private renderEmailConfirmationSection() {
    const { currentProfile, isConfirmEmailRequesting, translate: t } = this.props;
    const label = t('USERS:PROFILE-DETAILS-FORM:EMAIL-CONFIRMATION-STATUS', {
      status: currentProfile.isEmailConfirmed
        ? t('SHARED:STATUS:CONFIRMED')
        : t('SHARED:STATUS:UNCONFIRMED'),
    });
    return (
      currentProfile.isEmailConfirmed
        ? <div className={b('label')()}>{label}</div>
        : (
          <InputControl label={label}>
            <div className={b('button')()}>
              <Button
                type="button"
                color="blue"
                onClick={this.makeConfirmEmailButtonClickHandler(currentProfile.id)}
                isShowPreloader={isConfirmEmailRequesting}
                disabled={isConfirmEmailRequesting}
              >
                {t('SHARED:BUTTONS:CONFIRM')}
              </Button>
            </div>
          </InputControl>
        )
    );
  }

  @bind
  private renderUnlockSection() {
    const { currentProfile, isUnlockUserRequesting, translate: t } = this.props;
    const i18nKeyLabel = 'USERS:PROFILE-DETAILS-FORM:USER-LOCKING-STATUS';
    return (
      currentProfile.lockoutEnd && moment.now() < +moment(currentProfile.lockoutEnd)
        ? (
          <div>
            <div className={b('label')()}>
              {t(i18nKeyLabel, { status: t('SHARED:STATUS:LOCKED') })}
              {t('USERS:PROFILE-DETAILS-FORM:DATE-HINT', {
                date: moment(currentProfile.lockoutEnd).format('DD.MM.YYYY H:m'),
              })}
            </div>
            <div className={b('button')()}>
              <Button
                type="button"
                color="blue"
                onClick={this.makeUnlockButtonClickHandler(currentProfile.id)}
                isShowPreloader={isUnlockUserRequesting}
                disabled={isUnlockUserRequesting}
              >
                {t('SHARED:BUTTONS:Unlock')}
              </Button>
            </div>
          </div>
        ) : (
          <div className={b('label')()}>{t(i18nKeyLabel, { status: t('SHARED:STATUS:UNLOCKED') })}</div>
        )
    );
  }

  @bind
  private renderClaimsSection(user: IAdminPanelUser) {
    return (
      <div className={b('claims-section')()}>
        {user.claims.map(claim => this.renderClaim(claim))}
      </div>
    );
  }

  @bind
  private renderClaim(claim: IClaim) {
    return (
      <div className={b('claim')()} key={claim.id}>
        <div className={b('claim-row')()}>
          {getClaimTitle(claim.type)}
          <div>
            <Button
              iconKind="trash"
              type="button"
              color="red"
              onClick={this.makeClaimDeleteButtonClick(claim.id)}
            />
          </div>
        </div>
        <div className={b('claim-row')()}>{claim.value}</div>
      </div>
    );
  }

  @bind
  private renderControls() {
    const { onCancelButtonClick, isUpdateProfileRequesting, currentProfile, loggedInUser, translate: t } = this.props;
    const isLoggedInUserSupport = loggedInUser ? loggedInUser.roles.includes('Support') : false;
    const isCurrentProfileAdmin = currentProfile.roles.includes('Admin');
    return (
      <div className={b('controls')()}>
        <div className={b('controls-button')()}>
          <Button onClick={onCancelButtonClick} size={'large'} color="black-white">
            {t('SHARED:BUTTONS:CANCEL')}
          </Button>
        </div>
        <div className={b('controls-button')()}>
          <Button
            type="submit"
            size="large"
            isShowPreloader={isUpdateProfileRequesting}
            disabled={isLoggedInUserSupport && isCurrentProfileAdmin}
          >
            {t('SHARED:BUTTONS:SAVE')}
          </Button>
        </div>
      </div>
    );
  }

  @bind
  private makeUnlockButtonClickHandler(id: string) {
    return () => this.props.unlockUser(id);
  }

  @bind
  private makeConfirmEmailButtonClickHandler(id: string) {
    return () => this.props.confirmEmail(id);
  }

  @bind
  private makeClaimDeleteButtonClick(claimId: number) {
    return () => this.props.deleteUserClaim(claimId);
  }

  private initializeForm() {
    const { initialize, userRoles, currentProfile } = this.props;
    const {
      firstName, middleName, lastName, nickname, email, country, roles,
      isEmailConfirmed, twoFactorEnabled,
    } = currentProfile;
    const role = (() => {
      if (roles.length !== 0) {
        return userRoles.find(x => x.name.toLowerCase() === roles[0].toLowerCase());
      } else {
        return undefined;
      }
    })();
    initialize({
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      nickname: nickname || '',
      email,
      role,
      country: country ? country : undefined,
      isEmailConfirmed,
      twoFactorEnabled,
    });
  }
}

export default reduxForm<NS.IUsersForm, IOwnProps>({
  form: formName,
  onSubmit: (formValues, dispatch) => {
    const updatedUserFields = R.omit(['role'], formValues);
    dispatch(actions.updateUserProfile({
      ...updatedUserFields,
      roles: formValues.role ? [formValues.role.name] : [],
    }));
  },
})(
  connect(mapState, mapDispatch)(
    i18nConnect(ProfileDetailsForm)
  )
);
