import { WrappedFieldProps } from 'redux-form';
import block from 'bem-cn';
import * as React from 'react';
import { Textarea, ITextareaProps } from 'shared/view/elements';
import { default as TextareaAutosize } from 'react-textarea-autosize';

import './Textarea.scss';

interface IProps extends TextareaAutosize {
  error?: string;
}

const b = block('textarea-field');

class TextareaField extends React.PureComponent<IProps & WrappedFieldProps> {

  public render() {
    const { input, ...restTextareaProps } = this.props;

    return (
      <div className={b()}>
        <Textarea
          {...input}
          {...restTextareaProps}
        />
      </div>
    );
  }

}

export { ITextareaProps as ITextareaFieldProps, IProps };
export default TextareaField;
