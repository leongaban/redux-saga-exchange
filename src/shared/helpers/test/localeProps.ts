import { ITranslateProps } from 'services/i18n';

const localeProps: ITranslateProps = {
  translate: (x: string) => x,
  locale: 'en',
  Translate: jest.fn() as any,
};

export default localeProps;
