import block from 'bem-cn';
import React from 'react';
import {SortableContainer, SortableElement,  SortableHandle } from 'react-sortable-hoc';
import { bind } from 'decko';

import { Button } from 'shared/view/elements';
import { IAnnouncement } from 'shared/types/models';

import './AnnouncementsList.scss';

const b = block('announcements-list');

interface IProps {
  items: IAnnouncement[];
  loading: boolean;
  delete(index: number): void;
  edit(index: number): void;
}

const DragHandle = SortableHandle(() => <span className={b('drag-handle')()} >::</span>);

const SortableItem =
  SortableElement<{key: number, value: {content: string}, editItem(): void, deleteItem(): void}>
  (({key, value, editItem, deleteItem}) => (
    <li className={b('item')()} key={key}>
      <DragHandle />
      <div className={b('item-content')()} dangerouslySetInnerHTML={{__html: value.content}} />
      <div className={b('buttons')()}>
        <Button onClick={editItem} color="text-blue">Edit</Button>
        <Button onClick={deleteItem} color="text-blue">Delete</Button>
      </div>
    </li>
));

class AnnouncementsList extends React.Component<IProps> {

  public render() {
    const { items, loading } = this.props;
    return (
      <div className={b()}>
        <ul className={b('items')()}>
          {
            items.map((item, key) => {
              return (
                 <SortableItem
                    editItem={this.edit(key)}
                    deleteItem={this.delete(key)}
                    key={key}
                    index={key}
                    value={item}
                 />
              );
            })
          }
        </ul>
        {!loading && items.length === 0 && <p className={b('info-message')()}>There are no elements to display</p>}
      </div>
    );
  }

  @bind
  private delete(index: number) {
    return () => {
      this.props.delete(index);
    };
  }

  @bind
  private edit(index: number) {
    return () => {
      this.props.edit(index);
    };
  }
}

export default SortableContainer(AnnouncementsList);
