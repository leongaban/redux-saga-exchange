import * as React from 'react';
import block from 'bem-cn';
import { Icon } from 'shared/view/elements';
import './RateCell.scss';

interface IProps {
  value: string;
  selected?: boolean;
  postfix?: string;
  withArrow?: boolean;
}

const coloredArrows = {
  increased: require('../../img/top-inline.svg'),
  decreased: require('../../img/bottom-inline.svg'),
};

const whiteArrows = {
  increased: require('../../img/top_white-inline.svg'),
  decreased: require('../../img/bottom_white-inline.svg'),
};

const b = block('rate-cell');

function RateCell(props: IProps) {
  const { value, selected = false, postfix = '', withArrow = false } = props;
  const state = +value > 0 ? 'increased' : +value < 0 ? 'decreased' : 'unchanged';
  const prefix = +value > 0 ? '+' : '';
  return (
    <div className={b({ state, selected })()}>
      {
        withArrow
          ? state !== 'unchanged'
            ? <Icon src={selected ? whiteArrows[state] : coloredArrows[state]} className={b('icon')()} />
            : <div className={b('icon')()} />
          : null
      }
      <span className={b('value')()}>{`${prefix}${value}${postfix}`}</span>
    </div>
  );
}

export default RateCell;
