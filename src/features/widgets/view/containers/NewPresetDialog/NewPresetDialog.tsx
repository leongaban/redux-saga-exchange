import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';

import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { Modal, Button } from 'shared/view/elements';
import { isSuccessedByState } from 'shared/helpers/redux';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { IPreset } from 'shared/types/models';
import { required, maxLength } from 'shared/helpers/validators';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors } from 'services/config';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { newPresetFormEntry } from '../../../redux/reduxFormEntries';
import { actions, selectors } from '../../../redux';
import { INewPresetFormData } from '../../../namespace';

import './NewPresetDialog.scss';

interface IOwnProps {
  isOpen: boolean;
  onClose(): void;
}

interface IStateProps {
  addPresetCommunication: ICommunication;
  presetFieldValuesLength: number;
  presets: IPreset[];
}

interface IActionProps {
  setNotification: typeof notificationActions.setNotification;
  addPreset(x: INewPresetFormData): void;
}

type IProps = IOwnProps & IStateProps & IActionProps & InjectedFormProps<INewPresetFormData, IOwnProps>
  & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    addPresetCommunication: selectors.selectAddPresetCommunication(state),
    presetFieldValuesLength: configSelectors.selectCurrentPresetsLayouts(state).length,
    presets: configSelectors.selectPresets(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    ...actions,
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

const { name: formName, fieldNames } = newPresetFormEntry;

const validateByMax30 = maxLength(30);

const b = block('new-preset-dialog');

const NameFieldWrapper = Field as new () => Field<IInputFieldProps>;

class NewPresetDialog extends React.PureComponent<IProps> {
  public componentWillReceiveProps(nextProps: IProps) {
    if (isSuccessedByState(this.props.addPresetCommunication, nextProps.addPresetCommunication)) {
      nextProps.onClose();
    }
  }

  public render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal title="NEW PRESET" isOpen={isOpen} onClose={onClose} hasCloseCross>
        <form onSubmit={this.handleNewPresetSubmit}>
          <div className={b()}>
            <NameFieldWrapper
              component={InputField}
              name={fieldNames.name}
              placeholder="Preset name"
              validate={[required, validateByMax30, this.validateUniquePresetName]}
              autoFocus
            />
            <div className={b('add-button')()}>
              <Button>
                ADD PRESET
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }

  @bind
  private validateUniquePresetName(x?: string): string | undefined {
    if (x) {
      const { presets, translate: t } = this.props;
      if (presets.find(y => y.name === x)) {
        return t('WIDGETS:NEW-PRESET-DIALOG:DUPLICATE-PRESET-NAME-ERROR-TEXT');
      }
    }
  }

  @bind
  private handleNewPresetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { addPreset, handleSubmit, presetFieldValuesLength, setNotification } = this.props;
    if (presetFieldValuesLength >= 30) {
      setNotification({
        kind: 'error',
        text: 'Maximum volume of presets is exceeded, maximum is 30',
      });
    } else {
      handleSubmit(addPreset)(e);
    }
  }
}

function handleSubmitSuccess(result: INewPresetFormData, dispatch: Dispatch<any>, { reset }: IProps) {
  reset();
}

export default (
  reduxForm<INewPresetFormData, IOwnProps>({ form: formName, onSubmitSuccess: handleSubmitSuccess })(
    connect(mapState, mapDispatch)(
      i18nConnect(
        NewPresetDialog
      ))));
