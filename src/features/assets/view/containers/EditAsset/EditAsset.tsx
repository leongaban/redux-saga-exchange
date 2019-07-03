import * as React from 'react';
import block from 'bem-cn';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { bind } from 'decko';

import { Modal, InputControl, Button } from 'shared/view/elements';
import { InputField, CheckboxField, ICheckboxFieldProps, IInputFieldProps } from 'shared/view/redux-form';
import { IAppReduxState } from 'shared/types/app';
import { required, lessOrEqualThan } from 'shared/helpers/validators';
import { normalizeFloat, normalizeInteger } from 'shared/helpers/normalizers';
import { IAssetInfo } from 'shared/types/models';
import { actions as configActions } from 'services/config/redux';
import { ITranslateProps, i18nConnect } from 'services/i18n';

import { selectors, actions, reduxFormEntries } from '../../../redux';
import { IEditAssetForm } from '../../../namespace';
import './EditAsset.scss';

interface IStateProps {
  isOpen: boolean;
  currentAsset: IAssetInfo;
}

interface IDispatchProps {
  setEditAssetModalState: typeof actions.setEditAssetModalState;
}

type IProps = IStateProps & IDispatchProps & InjectedFormProps<IEditAssetForm> & ITranslateProps;

function mapState(state: IAppReduxState) {
  return {
    isOpen: selectors.selectEditAssetModalDisplayStatus(state),
    currentAsset: selectors.selectCurrentAsset(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IDispatchProps {
  return bindActionCreators({
    setEditAssetModalState: actions.setEditAssetModalState,
  }, dispatch);
}

const b = block('edit-asset');

const { editAssetFormEntry: { name: formName, fieldNames } } = reduxFormEntries;

const TextFieldWrapper = Field as new () => Field<IInputFieldProps>;
const CheckboxFieldWrapper = Field as new () => Field<ICheckboxFieldProps>;

class EditAsset extends React.PureComponent<IProps> {

  private lessOrEqualThanTen = lessOrEqualThan(
    this.props.translate('SHARED:ERROR:LESS-OR-EQUAL-THAN', { value: '10' }),
    10,
  );

  public render() {
    const { isOpen, currentAsset, translate: t } = this.props;
    const modalTitle = currentAsset
      ? `${t('ADMIN:ASSETS:EDIT')} (${currentAsset.assetName})`
      : '';
    return (
      <Modal
        isOpen={isOpen}
        title={modalTitle}
        onClose={this.handleModalClose}
        hasCloseCross
      >
        {currentAsset && this.renderEditAssetOptions()}
      </Modal>
    );
  }

  private renderEditAssetOptions() {
    const { currentAsset, translate: t } = this.props;
    return (
      <form className={b()} onSubmit={this.props.handleSubmit} ref={this.formRef}>
        <div className={b('options')()}>
          <InputControl label={t('ADMIN:ASSETS:WITHDRAWAL-FEE')}>
            <TextFieldWrapper
              component={InputField}
              name={fieldNames.withdrawalFee}
              validate={[required]}
              normalize={this.normalizeWithdrawalFee}
            />
          </InputControl>
          <InputControl label={t('ADMIN:ASSETS:SCALE')}>
            <TextFieldWrapper
              component={InputField}
              name={fieldNames.scale}
              validate={[required, this.lessOrEqualThanTen]}
              normalize={normalizeInteger}
            />
          </InputControl>
          <div className={b('checkbox-options')()}>
            <CheckboxFieldWrapper
              label={t('ADMIN:ASSETS:CAN-WITHDRAW')}
              component={CheckboxField}
              name={fieldNames.canWithdrawal}
              checked={currentAsset.canWithdrawal}
            />
            <CheckboxFieldWrapper
              label={t('ADMIN:ASSETS:CAN-DEPOSIT')}
              component={CheckboxField}
              name={fieldNames.canDeposit}
              checked={currentAsset.canDeposit}
            />
          </div>
        </div>
        <div className={b('controls')()}>
          <div className={b('button')()}>
            <Button type="button" onClick={this.handleCancelButtonClick} color="black-white">
              {t('SHARED:BUTTONS:CANCEL')}
            </Button>
          </div>
          <div className={b('button')()}>
            <Button>
              {t('SHARED:BUTTONS:SAVE')}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  @bind
  private formRef() {
    this.initForm(this.props.currentAsset);
  }

  private normalizeWithdrawalFee(value: string) {
    return normalizeFloat(value, 20);
  }

  private initForm(currentAsset: IAssetInfo) {
    this.props.initialize(currentAsset);
  }

  @bind
  private handleModalClose() {
    this.props.setEditAssetModalState(false);
  }

  @bind
  private handleCancelButtonClick() {
    this.handleModalClose();
  }
}

const connectedEditAsset = i18nConnect(connect(mapState, mapDispatch)(EditAsset));

export default (
  reduxForm<IEditAssetForm>({
    form: formName,
    onSubmit: (formValues: IAssetInfo, dispatch: Dispatch<IAppReduxState>) => {
      dispatch(configActions.saveAssetInfo(formValues));
      dispatch(actions.setEditAssetModalState(false));
    }
  })(connectedEditAsset)
);
