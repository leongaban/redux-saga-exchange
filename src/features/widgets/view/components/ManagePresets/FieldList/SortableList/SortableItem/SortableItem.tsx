import * as React from 'react';
import block from 'bem-cn';
import { Field } from 'redux-form';

import { SortableElement, SortableHandle } from 'react-sortable-hoc';

import { IPreset } from 'shared/types/models';
import { Button } from 'shared/view/elements';
import { InputField, IInputFieldProps } from 'shared/view/redux-form';
import { requiredPresetName, presetMaxLengthName } from 'shared/helpers/validators';

const PresetFieldWrapper = Field as new () => Field<IInputFieldProps>;

const b = block('manage-presets-field-list');

const DragHandle = SortableHandle(() => (
  <img src={require('./images/sort.svg')} className={b('drag-handle')()} />
));

interface ISortableItemProps {
  name: string;
  preset: IPreset;
  isDeleted: boolean;
  onButtonClick(): void;
}

const getPresetName = (x: IPreset) => x.name;

function makePresetNormalizer(preset: IPreset) {
  return (value?: string) => ({ ...preset, name: value });
}

const validateByMax30 = presetMaxLengthName(30);

const SortableItem = SortableElement((props: ISortableItemProps) => {
  const { onButtonClick, preset, name, isDeleted = false } = props;
  return (
    <div className={b('item')()} >
      <DragHandle />
      <div className={b('item-element', { 'located-before-handle': true })()}>
        <PresetFieldWrapper
          component={InputField}
          name={name}
          format={getPresetName}
          normalize={makePresetNormalizer(preset)}
          validate={[requiredPresetName, validateByMax30]}
          validateOnChange
        />
      </div>
      <div className={b('item-element')()}/>
      {isDeleted
        ? <div className={b('button')()} onClick={onButtonClick}>
            <Button color="red" type="button" iconKind="trash" />
          </div>
        : <div className={b('button')()}/>
      }
    </div>
  );
});

export default SortableItem;
