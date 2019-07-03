import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { arrayPush } from 'redux-form';

import { Modal } from 'shared/view/elements';
import { IPreset } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors } from 'services/config';

import { actions, selectors } from '../../../redux';
import { managePresetsFormEntry } from '../../../redux/reduxFormEntries';
import { Presets } from '../../components/ManagePresets';

import './ManagePresets.scss';

interface IStateProps {
  presets: IPreset[];
  presetFieldValuesLength: number;
}

interface IActionProps {
  setNotification: typeof notificationActions.setNotification;
  setPresets(presets: IPreset[]): void;
  addPresetField(value: IPreset): void;
}

const { name: formName, fieldNames } = managePresetsFormEntry;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    ...actions,
    addPresetField: (value: IPreset) => arrayPush(formName, fieldNames.presets, value),
    setNotification: notificationActions.setNotification,
  }, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    presets: configSelectors.selectPresets(state),
    presetFieldValuesLength: selectors.selectPresetsFieldValuesLength(state),
  };
}

interface IProps {
  isOpen: boolean;
  onClose(): void;
}

const b = block('manage-presets');

class ManagePresets extends React.PureComponent<IProps & IStateProps & IActionProps> {

  public render() {
    const {
      isOpen,
      onClose,
      presets,
      setPresets,
      addPresetField,
      presetFieldValuesLength,
      setNotification,
     } = this.props;

    return (
      <div className={b()}>
        <Modal title="PRESETS" isOpen={isOpen} onClose={onClose} hasCloseCross>
          <Presets
            presets={presets}
            setPresets={setPresets}
            onClose={onClose}
            addPresetField={addPresetField}
            presetFieldValuesLength={presetFieldValuesLength}
            setNotification={setNotification}
          />
        </Modal>
      </div>
    );
  }
}

export default connect<IStateProps, IActionProps, IProps>(mapState, mapDispatch)(ManagePresets);
