import * as React from 'react';
import block from 'bem-cn';
import { ITab } from 'shared/types/ui';

import './Segments.scss';

interface IProps {
  segments: ITab[];
  size: 'large' | 'medium' | 'small';
  font?: 'small';
  background?: 'grey';
}

const b = block('segments');

class Segments extends React.PureComponent<IProps> {

  public render() {
    const { segments, size, font = '', background = '' } = this.props;
    return (
      <div className={b({ font })()}>
        {
          segments.map(segment => (
            <div
              key={segment.key}
              onClick={!segment.disabled ? segment.onClick : void(0)}
              className={b('item', {
                selected: segment.active,
                size,
                background,
                disabled: !!segment.disabled,
              })()}
            >
              {segment.title}
            </div>
          ))
        }
      </div>
    );
  }

}

export default Segments;
export { IProps as ISegmentsProps };
