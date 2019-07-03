import * as React from 'react';
import block from 'bem-cn';

import { transformAssetName } from 'shared/helpers/converters';

import './CoinCell.scss';

interface IProps {
  code: string;
  iconSrc: string;
}

const b = block('coin-cell');

class CoinCell extends React.PureComponent<IProps> {
  public render() {
    const { code, iconSrc } = this.props;
    return (
      <div className={b()}>
        <img
          className={b('icon')()}
          src={iconSrc}
          alt={code}
        />
        <div className={b('label')()}>
          {transformAssetName(code)}
        </div>
      </div>
    );
  }
}

export default CoinCell;
