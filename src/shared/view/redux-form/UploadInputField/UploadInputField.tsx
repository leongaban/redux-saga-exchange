import * as React from 'react';
import block from 'bem-cn';
import Dropzone, { DropzoneProps } from 'react-dropzone';

import { WrappedFieldProps } from 'redux-form';
import { bind } from 'decko';

import './UploadInputField.scss';

interface IProps extends DropzoneProps {
  dropzoneClassName?: string;
  onFileDrop?(files: File[], rejectedFiles?: File[]): void;
}

const b = block('upload-input-field');

class UploadInputField extends React.PureComponent<IProps & WrappedFieldProps> {

  public render() {
    const { input, children, dropzoneClassName, accept, onFileDrop: _, ...restProps } = this.props;

    return (
      <div className={b()}>
        <Dropzone
          {...restProps}
          name={input.name}
          accept={accept}
          className={dropzoneClassName ? dropzoneClassName : b('dropzone')()}
          onDrop={this.handleOnDrop}
        >
          {children}
        </Dropzone>
      </div>
    );
  }

  @bind
  private handleOnDrop(files: File[], rejectedFiles?: File[]) {
    const { onFileDrop, input } = this.props;
    if (onFileDrop) {
      onFileDrop(files, rejectedFiles);
    } else {
      input.onChange(files[0]);
    }
  }
}

export { IProps as IUploadInputFieldProps };
export default UploadInputField;
