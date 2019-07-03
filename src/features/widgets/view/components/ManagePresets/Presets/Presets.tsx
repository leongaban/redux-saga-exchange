import * as React from 'react';
import block from 'bem-cn';
import { FieldArray, reduxForm, InjectedFormProps } from 'redux-form';
import { bind } from 'decko';
import * as R from 'ramda';

import { Button } from 'shared/view/elements';
import { IPreset } from 'shared/types/models';
import { actions as notificationActions } from 'services/notification';
import { i18nConnect, ITranslateProps } from 'services/i18n';

import { managePresetsFormEntry } from '../../../../redux/reduxFormEntries';
import { IManagePresetsFormData } from '../../../../namespace';
import { FieldList, IFieldListProps, NewPreset } from '..';
import './Presets.scss';

interface IOwnProps {
  presets: IPreset[];
  presetFieldValuesLength: number;
  setNotification: typeof notificationActions.setNotification;
  setPresets(presets: IPreset[]): void;
  addPresetField(value: IPreset): void;
  onClose(): void;
}

type IProps = IOwnProps & InjectedFormProps<IManagePresetsFormData, IOwnProps & ITranslateProps> & ITranslateProps;

const { name: formName, fieldNames } = managePresetsFormEntry;

const b = block('manage-presets-form');

const PresetsFields = FieldArray as new () => FieldArray<IFieldListProps>;

class ManagePresetsForm extends React.PureComponent<IProps> {
  public componentDidMount() {
    const { initialize, presets } = this.props;
    initialize({ presets });
  }

  public render() {
    const { onClose, change, presetFieldValuesLength, setNotification, addPresetField } = this.props;

    return (
      <div className={b()}>
        <div className={b('section')()}>
          <NewPreset
            addPresetField={addPresetField}
            presetFieldValuesLength={presetFieldValuesLength}
            setNotification={setNotification}
          />
          <form onSubmit={this.handleManagePresetsSubmit} id={formName}>
            <PresetsFields
              component={FieldList}
              name={fieldNames.presets}
              changeField={change}
            />
          </form>
        </div>
        <div className={b('section')()}>
          <div className={b('buttons')()}>
            <div className={b('button')()}>
              <Button color="black-white" type="button" onClick={onClose}>
                CANCEL
              </Button>
            </div>
            <div className={b('button')()}>
              <Button color="green" type="submit" form={formName}>
                SAVE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @bind
  private handleManagePresetsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { setPresets, handleSubmit } = this.props;
    handleSubmit(({ presets }: IManagePresetsFormData) => setPresets(presets))(e);
  }
}

export default (
  i18nConnect(
    reduxForm<IManagePresetsFormData, IOwnProps & ITranslateProps>({
      form: formName,
      validate: (
        { presets }: IManagePresetsFormData,
        { translate: t }: IProps,
      ): Record<keyof IManagePresetsFormData, any> => {
        if (presets) {
          const namesCount = R.countBy((x => x.name), presets);

          const presetsErrors = presets.map(x => namesCount[x.name] > 1
            ? t('WIDGETS:MANAGE-PRESETS:DUPLICATE-PRESET-NAME-ERROR-TEXT')
            : void 1
          );

          return {
            presets: presetsErrors,
          };
        }
        return { presets: [] };
      },
    })(
      ManagePresetsForm
    )));
