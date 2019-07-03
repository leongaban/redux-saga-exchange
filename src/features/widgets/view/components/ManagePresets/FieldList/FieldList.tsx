import * as React from 'react';

import { WrappedFieldArrayProps } from 'redux-form';
import { bind } from 'decko';

import { SortableContainerProps, SortEnd } from 'react-sortable-hoc';

import { IPreset } from 'shared/types/models';

import SortableList from './SortableList/SortableList';

interface IOwnProps {
  changeField(name: string, value: any): void;
}

type IProps = WrappedFieldArrayProps<IPreset> & IOwnProps;

class FieldList extends React.PureComponent<IProps & SortableContainerProps> {

  public render() {

    const { fields } = this.props;

    return (
      <SortableList
        fields={fields}
        onButtonClick={this.handleRemovableItemClick}
        onSortEnd={this.handleSortEnd}
        useDragHandle
      />
    );
  }

  @bind
  private handleSortEnd({ newIndex, oldIndex }: SortEnd) {
    if (newIndex !== oldIndex) {
      this.props.fields.swap(oldIndex, newIndex);
    }
  }

  @bind
  private handleRemovableItemClick(index: number) {
    this.props.fields.remove(index);
  }
}

type IFieldListProps = IOwnProps & SortableContainerProps;

export { IFieldListProps };
export default FieldList;
