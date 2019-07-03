import * as React from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';

interface IProps {
  initialValue: string;
  plugins: string;
  toolbar: string;
  height: number;
  onChange({}): void;
}

const Editor: React.SFC<IProps> = ({onChange, initialValue, plugins, toolbar, height}) => {
  return (
    <TinyEditor
      initialValue={initialValue}
      init={{
        plugins,
        toolbar,
        height
      }}
      onChange={onChange}
    />
  );
};

export default Editor;
