import 'reflect-metadata';
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import configureApp from 'core/configureApp';
import * as ReactModal from 'react-modal';
import rg4js from 'raygun4js';

import { AppContainer } from 'react-hot-loader';
import App from 'core/App';

const version: string = '0.0.1';

ReactModal.setAppElement('#root');

let appData = configureApp();
const render = (component: React.ReactElement<any>) => ReactDOM.render(
  <AppContainer>{component}</AppContainer>,
  document.getElementById('root'),
);

/* Start application */
render(<App modules={appData.modules} store={appData.store} history={appData.history} />);

/* Hot Module Replacement API */
if ((module as any).hot && process.env.NODE_ENV !== 'production') {
  (module as any).hot.accept(['./core/App', './core/configureApp'], () => {
    const nextConfigureApp: typeof configureApp = require('./core/configureApp').default;
    const NextApp: typeof App = require('./core/App').default;
    appData = nextConfigureApp(appData);
    render(<NextApp modules={appData.modules} store={appData.store} history={appData.history} />);
  });
}

((StockChartX) => {
  StockChartX.BarPlot.defaults.columnWidthRatio = 0.7;
  StockChartX.HistogramPlot.defaults.columnWidthRatio = 0.7;
})((window as any).StockChartX);

/* tslint:disable */
console.info(`%cApp version: ${version}`, 'background: #EBF5F8; color: gray; font-size: x-medium; border-radius: 5px; padding: 5px;');
/* tslint:enable */

/* Set up raygun */
const apiKey = document.domain.includes('stage') ? 'UxHinVsX9mUn+PedaPDoHQ==' : 'HEfHFPW7SiXIS5eOuJC/FQ==';
rg4js('apiKey', apiKey);
rg4js('enableCrashReporting', true);
rg4js('enablePulse', true);
