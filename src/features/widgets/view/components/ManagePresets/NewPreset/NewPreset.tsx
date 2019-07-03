import React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Dispatch } from 'react-redux';

import { actions as notificationActions } from 'services/notification';
import { Button } from 'shared/view/elements';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { defaultPreset } from 'shared/constants';
import { IPreset } from 'shared/types/models';

import { required, maxLength } from 'shared/helpers/validators';

import { addPresetFormEntry } from '../../../../redux/reduxFormEntries';
import { IAddPresetFormData } from '../../../../namespace';
import './NewPreset.scss';

const { fieldNames, name: formName } = addPresetFormEntry;

const b = block('manage-presets-field-list');

const NewPresetField = Field as new () => Field<IInputFieldProps>;

interface IOwnProps {
  presetFieldValuesLength: number;
  setNotification: typeof notificationActions.setNotification;
  addPresetField(value: IPreset): void;
}

type IProps = IOwnProps & InjectedFormProps<IAddPresetFormData, IOwnProps>;

const validateByMax30 = maxLength(30);

class NewPreset extends React.PureComponent<IProps> {
  public render() {
    return (
      <form className={b('item', { 'for-new-preset': true })()} onSubmit={this.handleNewPresetFormSubmit} >
        <div className={b('item-element')()}>
          <NewPresetField
            component={InputField}
            name={fieldNames.name}
            placeholder="Add Preset"
            validate={[required, validateByMax30]}
            validateOnChange
          />
        </div>
        <div className={b('item-element')()} />
        <div className={b('button')()}>
          <Button color="green" type="submit" iconKind="plus" />
        </div>
      </form>
    );
  }

  @bind
  private handleNewPresetFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { addPresetField, handleSubmit, presetFieldValuesLength, setNotification } = this.props;
    if (presetFieldValuesLength < 30) {
      handleSubmit(({ name }: IAddPresetFormData) => {
        addPresetField({
          name,
          settings: defaultPreset.settings,
          layouts: defaultPreset.layouts,
        });
      })(e);
    } else {
      setNotification({
        kind: 'error',
        text: 'Maximum volume of presets is exceeded, maximum is 30',
      });
    }
  }
}

function handleSubmitSuccess(result: IAddPresetFormData, dispatch: Dispatch<any>, { reset }: IProps) {
  reset();
}

export default reduxForm<IAddPresetFormData, IOwnProps>({
  form: formName,
  onSubmitSuccess: handleSubmitSuccess,
})(NewPreset);
