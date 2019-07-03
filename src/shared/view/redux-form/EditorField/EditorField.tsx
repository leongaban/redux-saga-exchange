import * as React from 'react';
import { bind } from 'decko';
import { Editor } from 'shared/view/elements';
import { WrappedFieldProps } from 'redux-form';

interface IProps {
  input: {
    value: string,
    onChange(value: string): void
  };
  height: number;
  toolbar: string;
  plugins: string;
}

interface IEvent {
  target: {
    getContent(): string
  };
}

class EditorField extends React.PureComponent<IProps & WrappedFieldProps> {
  public render() {
    const { input, height, toolbar, plugins } = this.props;

    return (
      <Editor
        height={height}
        toolbar={toolbar}
        plugins={plugins}
        initialValue={input.value}
        onChange={this.onChange}
      />
    );
  }

  @bind
  public onChange(event: IEvent) {
    this.props.input.onChange(event.target.getContent());
  }

}

export default EditorField;
