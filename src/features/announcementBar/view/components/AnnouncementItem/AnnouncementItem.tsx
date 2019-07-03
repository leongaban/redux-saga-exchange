import * as React from 'react';
import block from 'bem-cn';

import './AnnouncementItem.scss';

interface IProps {
  data: {
    content: string
  };
}

const b = block('announcement-item');

class AnnouncementItem extends React.PureComponent<IProps> {
  public render() {
    const {
      data
    } = this.props;
    return (
      <div className={b('content')()}>
        <div dangerouslySetInnerHTML={{__html: data.content}} />
      </div>
    );
  }
}

export default AnnouncementItem;
