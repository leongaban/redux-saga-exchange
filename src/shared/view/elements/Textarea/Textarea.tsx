import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import * as React from 'react';
import block from 'bem-cn';

import './Textarea.scss';

const b = block('textarea');

class Textarea extends React.PureComponent<TextareaAutosize> {

  public render() {
    return (
      <TextareaAutosize
        {...this.props}
        className={b()}
      />
    );
  }
}

export default Textarea;
export { TextareaAutosizeProps as ITextareaProps };
