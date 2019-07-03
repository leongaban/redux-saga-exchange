interface IWebchatSettings {
  websocketServer: string;
  restServer: string;
  avatarUrl: string;
  loginServer: string;
  defaultChannel: string;
}

interface ISettings {
  nodeWebsocketServer: string;
  signalWebsocketServerPublic: string;
  signalWebsocketServerPrivate: string;
  restServerAddress: string;
  captchaSiteKey: string;
  webchat: IWebchatSettings;
  simplexAddress: string;
}

// because test we using as subdomain locally
const domainName: string = document.domain.split('.').filter(x => x !== 'test').join('.');
// const domainName: string = 'stressenv.trd.io/';
// const domainName: string = 'devenv.trd.io/';

const chatDomain = domainName === 'exchange.trd.io' ? 'chat.trd.io' : 'chat.devenv.trd.io';
const simplexDomain = domainName === 'exchange.trd.io' || domainName === 'stressenv.trd.io'
  ? 'https://simplex.trd.io/'
  : 'https://simplex-frontend.herokuapp.com/';

const productionEnv: ISettings = {
  nodeWebsocketServer: 'wss://tradeio-node.azurewebsites.net/socket',
  signalWebsocketServerPublic: `https://api.${domainName}/marketdata-ws/info`,
  signalWebsocketServerPrivate: `https://api.${domainName}/frontoffice/ws/account`,
  restServerAddress: `https://api.${domainName}`,
  webchat: {
    websocketServer: `wss://${chatDomain}/websocket`,
    restServer: `https://${chatDomain}/api/v1`,
    avatarUrl: `https://${chatDomain}/avatar`,
    loginServer: `https://api.${domainName}/frontoffice/api/chat/login`,
    defaultChannel: 'general',
  },
  captchaSiteKey: '6LeJ44sUAAAAAB2coW45LFbTIDsOJ9V0v37STKND',
  simplexAddress: simplexDomain,
};

const CUSTOM_CONFIG = process.env.CUSTOM_CONFIG;

let env: ISettings = { ...productionEnv };
if (Object.keys(CUSTOM_CONFIG).length > 0) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('%cWarning! %cUsed custom config file with redefined properties, please be sure you use ' +
      'correct URLs to WebSocket and API!', 'color: #A00; font-size: 16px;', 'color: #00A; font-size: 12px;');

    // If config contains property 'config'
    if ('domains' in CUSTOM_CONFIG) {
      const domain = document.domain;
      // If current domain configured in file
      if (domain in CUSTOM_CONFIG.domains) {
        env = { ...CUSTOM_CONFIG.domains[domain] };
      } else {
        console.info('Domain [' + domain + '] not configured in config file, used PROD variables!');
      }
    } else {
      // Property 'domains' not found in current config file
      env = { ...CUSTOM_CONFIG };
    }
  } else {
    // Production mode
    env = { ...CUSTOM_CONFIG };
  }
}

/**
 * Ссылка на WebSocket сервер обслуживающий клиентские запросы.
 * Мотивация: обеспечение полчения оперативных данных для графиков с
 * целью анимации их изменения по последним сводкам
 * @type {string} формализованная контурозависимая ссылка на WebSocket сервер
 */
export const nodeWebsocketServer: string =
  env.nodeWebsocketServer || productionEnv.nodeWebsocketServer;

export const signalWebsocketServerPublic: string =
  env.signalWebsocketServerPublic || productionEnv.signalWebsocketServerPublic;

export const signalWebsocketServerPrivate: string =
  env.signalWebsocketServerPrivate || productionEnv.signalWebsocketServerPrivate;

export const restServerAddress: string =
  env.restServerAddress || productionEnv.restServerAddress;

export const webchat: IWebchatSettings = env.webchat || productionEnv.webchat;
export const captchaSiteKey: string = env.captchaSiteKey || productionEnv.captchaSiteKey;

export const simplexAddress = env.simplexAddress || productionEnv.simplexAddress;

export { ISettings, productionEnv };
