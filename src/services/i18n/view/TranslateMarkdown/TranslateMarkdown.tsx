import * as React from 'react';
import Markdown from 'react-markdown';

import { ITranslateProps, i18nConnect } from 'services/i18n';

interface IProps {
  className?: string;
  stringKey: string;
  args?: { [key: string]: any };
}

const TranslateMarkdown: React.SFC<IProps> = ({ translate, stringKey, args, className }: IProps & ITranslateProps) => (
  <Markdown
    className={className}
    unwrapDisallowed
    disallowedTypes={['link', 'paragraph']}
    source={translate(stringKey, args)}
  />
);

export default i18nConnect(TranslateMarkdown);
