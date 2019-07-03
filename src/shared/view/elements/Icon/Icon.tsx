import * as React from 'react';
import block from 'bem-cn';

import InlineSvg from 'svg-inline-react';

import './Icon.scss';

interface IProps {
  className: string;
  src: string;
}

const b = block('icon');

function Icon({ className, src }: IProps) {
  return <InlineSvg src={src} className={b.mix(className)()} />;
}

export default Icon;
