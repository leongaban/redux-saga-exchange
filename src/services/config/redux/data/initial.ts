import { initialCommunicationField } from 'shared/helpers/redux';
import { getUserAgentInfo } from '../helpers';

import * as NS from '../../namespace';
import { MobileDetector, getInitialTheme } from '../../helpers';

const mobileDetector = new MobileDetector(window.navigator.userAgent);

const initial: NS.IReduxState = {
  data: {
    securitySettings: {
      loginTriesBeforeCaptcha: 5,
      loginTriesBeforeLock: 10,
      loginRetryPeriod: 30000,
      restorePassTriesBeforeLock: 5,
      restorePassRetryPeriod: 30000,
    },
    protectActions: [],
    countries: [],
    currencyPairs: [],
    assetsInfo: {},
    userAgent: getUserAgentInfo(),
    userConfig: null,
  },
  edit: {
    currentPresetsLayouts: [],
    presetsHaveUnsavedChanges: false,
    mobile: {
      currentCurrencyPairID: null,
    },
  },
  communication: {
    loadSecuritySettings: initialCommunicationField,
    loadCurrencyPairs: initialCommunicationField,
    loadCountries: initialCommunicationField,
    loadAssetsInfo: initialCommunicationField,
    loadUserConfig: initialCommunicationField,
    saveUserConfig: initialCommunicationField,
    mLoadConfig: initialCommunicationField,
    saveTheme: initialCommunicationField,
  },
  ui: {
    clientDeviceType: process.env.MOBILE
      ? mobileDetector.isClientDeviceMobile()
        ? 'mobile'
        : 'desktop'
      : 'desktop',
    theme: getInitialTheme(),
  },
};

export default initial;
