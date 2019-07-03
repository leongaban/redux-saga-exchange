import { IReduxState } from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

const initial: IReduxState = {
  data: {
    locales: {
      en: {},
    },
    currentLocale: process.env.LANG || 'en',
  },
  communications: {
    changeLanguageFetching: { ...initialCommunicationField },
  },
};

export default initial;
