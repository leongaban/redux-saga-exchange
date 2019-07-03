// Global definitions (you shouldn't import it, it is global scope)
/* tslint:disable */
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?(): any;
  jQuery: any;
  $: any;
  TradingView: typeof TradingView;
  chatButton: any; // Key Should be the same as in index.html 
  grecaptcha: {
    execute: (siteKey: string, options: IGrecaptchaExecuteOptions) => Promise<string>,
    ready: (cb: () => void) => void,
  }; // google recaptcha instance
}

interface IGrecaptchaExecuteOptions {
  action: 'homepage' | 'login' | 'social' | 'e-commerce',
}

interface SinonStub {
  callsFake: Function;
}

interface WebpackModule {
  hot: boolean;
  accept: Function;
}

interface Element {
  src: string;
}


declare module 'raygun4js';
declare module 'redux-async-connect';
declare module 'react-geosuggest';
declare module 'normalizr';
declare module '*.scss';
declare module '*.png';
declare module 'decko';
declare module 'svg-inline-react';
declare module 'react-hot-loader';
declare module 'enzyme-adapter-react-16';
declare module 'postcss-reporter';
declare module 'postcss-easy-import';
declare module 'postcss-scss';
declare module 'stylelint';
declare module 'doiuse';
declare module 'html-webpack-include-assets-plugin';
declare module 'favicons-webpack-plugin';
declare module 'react-pdf/dist/entry.noworker';
declare module 'wallet-address-validator';
declare module 'bchaddrjs';
declare module 'react-draggable';
