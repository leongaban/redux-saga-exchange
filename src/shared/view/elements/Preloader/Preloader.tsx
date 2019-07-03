import * as React from 'react';
import block from 'bem-cn';

import './Preloader.scss';

interface IProps {
  isShow: boolean;
  type?: 'button' | 'default';
  size?: number;
  position?: 'relative' | 'fixed' | 'static';
}

const b = block('preloader');

const preloaderImg = {
  button: require('./img/button_loader.svg'),
  default: require('./img/loader.svg'),
};
class Preloader extends React.PureComponent<IProps> {

  public render() {
    const { size, type = 'default', isShow, children, position } = this.props;
    const image = preloaderImg[type];
    if (isShow) {
      return (
        <div className={b()} style={{ position }}>
          <div
            style={{ width: size && `${size}rem`, height: size && `${size}rem`, backgroundImage: `url(${image})` }}
            className={b('spinner')()}
          />
        </div>
      );
    }
    return children || null;
  }
}

export { IProps };
export default Preloader;
