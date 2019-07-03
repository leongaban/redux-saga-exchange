import * as React from 'react';
import block from 'bem-cn';
import { FieldsProps } from 'redux-form';

import { SortableContainer } from 'react-sortable-hoc';

import { IPreset } from 'shared/types/models';

import SortableItem from './SortableItem/SortableItem';

const b = block('manage-presets-field-list');

interface ISortableListProps {
  fields: FieldsProps<IPreset>;
  onButtonClick(index: number): void;
}

const SortableList =
  SortableContainer((props: ISortableListProps) => {
    const { onButtonClick, fields } = props;
    const isDeletedItem = fields.length > 1;
    return (
      <div className={b('list')()}>
        {fields.map((name: string, index: number) => {

          const handleClick = () => onButtonClick(index);
          return (
            <SortableItem
              onButtonClick={handleClick}
              index={index}
              name={name}
              preset={fields.get(index)}
              key={index}
              isDeleted={isDeletedItem}
            />
          );
        })}
      </div>
    );
  });

export default SortableList;
