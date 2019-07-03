import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';

import * as CleanWebpackPlugin from 'clean-webpack-plugin';

import * as postcssReporter from 'postcss-reporter';
import * as postcssSCSS from 'postcss-scss';
import * as autoprefixer from 'autoprefixer';
import * as stylelint from 'stylelint';
import * as doiuse from 'doiuse';

import { ROUTES_PREFIX } from '../src/core/constants';

const chunkName = process.env.NODE_ENV === 'production' ? 'id' : 'name';
const chunkHash = process.env.WATCH_MODE ? 'hash' : 'chunkhash';
const hot = !!process.env.WATCH_MODE;

// http://www.backalleycoder.com/2016/05/13/sghpa-the-single-page-app-hack-for-github-pages/
const isNeed404Page: boolean = process.env.NODE_ENV_MODE === 'gh-pages' ? true : false;

let customConfig: any = {};
if (process.env.NODE_ENV !== 'production') {
  const customConfigFilePath = __dirname + '/../src/config.custom.json';
  try {
    customConfig = require(customConfigFilePath);
    console.info('Custom config file ' + customConfigFilePath + ' successful loaded, matched config ' +
      'parameters will be overriden');
  } catch (e) {
    console.info('Custom config file [' + customConfigFilePath + '] not found, use default ' +
      'config parameters! Reason:');
    console.error(e);
  }
} else if (process.env.CONTOUR !== '') {
  const contourConfigFilePath = __dirname + '/../src/config.' + process.env.CONTOUR + '.json';
  try {
    customConfig = require(contourConfigFilePath);
    console.info('Contour config file [' + contourConfigFilePath + '] successfuly loaded');
  } catch (e) {
    console.info('Contour config [' + contourConfigFilePath + '] not found');
  }
}

// Объект, содержащий имена библиотек, которые будут использоваться для сборки проекта.
// Сделано для того, чтобы можно было указать в custom.config.json библиотеку StockChartX.js вместо
// StockChartX.min.js (для возможности наиболее удобной отладки кода чарта)
const libsConfig: any = {
  StockChart: 'StockChartX.min.js',
};

if ('libs' in customConfig && customConfig.libs instanceof Object) {
  Object.keys(customConfig.libs).map(libName =>
    libName in libsConfig && (libsConfig[libName] = customConfig.libs[libName]));
}

export const commonPlugins: webpack.Plugin[] = [
  new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname, '..') }),
  new webpack.HashedModuleIdsPlugin(),
  new CopyWebpackPlugin([
    { from: 'assets/scripts', to: 'js/' },
    { from: 'assets/scripts/dev', to: 'js/' },
    { from: 'assets/view', to: 'view/' },
    { from: 'assets/locales', to: 'locales/' },
    { from: 'assets/css', to: 'css/' },
    { from: 'assets/fonts', to: 'fonts/' },
    { from: 'assets/img', to: 'img/' },
    { from: 'assets/charting_library', to: 'charting_library/' },
    // { from: '../src/services/i18n/locales/trade-en.json', to: '../build/locales' },
  ]),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'assets/index.html',
    chunksSortMode: sortChunks,
  }),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    async: false,
    tsconfig: path.resolve('./tsconfig.json'),
    tslint: path.resolve('./tslint.json'),
  }),
  new HtmlWebpackIncludeAssetsPlugin({
    assets: [
      'js/jquery.min.js',
      'js/jquery-ui.min.js',
      'js/bootstrap.min.js',
      'js/moment.min.js',
      'js/detectizr.min.js',
      'js/i18next.min.js',
      'js/i18nextXHRBackend.min.js',
      'js/jquery-i18next.min.js',
      'js/' + libsConfig.StockChart,
      'js/StockChartX.UI.min.js',
      'js/StockChartX.External.min.js',
      'js/custom-indicators.js',
      'js/custom-sma.js',
      'js/canvas-to-blob-min.js',
      'css/bootstrap.min.css',
      'css/StockChartX.min.css',
      'css/StockChartX.UI.min.css',
      'css/StockChartX.External.min.css',
      'charting_library/charting_library.min.js',
    ],
    append: false,
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.NODE_ENV_MODE': JSON.stringify(process.env.NODE_ENV_MODE),
    'process.env.__HOST__': JSON.stringify('https://api.tradeiodev.xyz'),
    'process.env.CUSTOM_CONFIG': JSON.stringify(customConfig || {}),
    'process.env.MOBILE': JSON.stringify(process.env.MOBILE),
  }),
].concat(isNeed404Page ? (
  new HtmlWebpackPlugin({
    filename: '404.html',
    template: 'assets/index.html',
    chunksSortMode: sortChunks,
  })
) : []).concat(!hot ? (
  new FaviconsWebpackPlugin({
    logo: 'shared/view/images/logo.svg',
    emitStats: false,
    prefix: 'icons-[hash]/',
    persistentCache: true,
    inject: true,
  })
) : []);

export const commonRules: webpack.Rule[] = [
  {
    test: /\.(ts|tsx)$/,
    use: ([] as any[])
      .concat(hot ? 'react-hot-loader/webpack' : [])
      .concat([
        'cache-loader',
        {
          loader: 'thread-loader',
          options: {
            workers: require('os').cpus().length - 1,
            poolTimeout: hot ? Infinity : 2000,
          },
        },
        {
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            logLevel: 'error',
          },
        },
      ]),
  },
  {
    test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
    use: 'file-loader?name=fonts/[hash].[ext]',
  },
  {
    test: /-inline\.svg$/,
    loader: 'svg-inline-loader',
  },
  {
    test: /\.(png|svg|jpg|gif)/,
    exclude: [/(-inline\.svg)/],
    loader: 'url-loader',
    options: {
      name: 'images/[name].[ext]',
      limit: 10000,
      mimeType: 'image/gif',
    },
  }
];

export const commonScssLoaders: webpack.Loader[] = [
  'css-loader?importLoaders=1',
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => {
        return [
          autoprefixer({
            browsers: ['last 2 versions'],
          }),
        ];
      },
    },
  },
  { loader: 'sass-loader', options: { includePaths: ['src', 'absolute/path/b'] } },
  {
    loader: 'postcss-loader',
    options: {
      syntax: postcssSCSS,
      plugins: () => {
        return [
          stylelint(),
          doiuse({
            browsers: ['ie >= 11', 'last 2 versions'],
            ignore: ['flexbox', 'rem', 'outline', 'viewport-units'],
            ignoreFiles: ['**/normalize.css'],
          }),
          postcssReporter({
            clearReportedMessages: true,
            throwError: true,
          }),
        ];
      },
    },
  },
];

export const commonConfig: webpack.Configuration = {
  target: 'web',
  context: path.resolve(__dirname, '..', 'src'),
  output: {
    crossOriginLoading: 'anonymous',
    publicPath: ROUTES_PREFIX + '/',
    path: path.resolve(__dirname, '..', 'build'),
    filename: `js/[name]-[${chunkHash}].bundle.js`,
    chunkFilename: `js/[${chunkName}]-[${chunkHash}].bundle.js`,
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimize: false,
  },
  stats: {
    warningsFilter: /export .* was not found in/      // TODO: delete when ts-loader will be updated
  },
  devServer: {
    hot,
    contentBase: path.resolve('..', 'build'),
    host: '0.0.0.0',
    port: 8000,
    inline: true,
    https: true,
    lazy: false,
    historyApiFallback: true,
    disableHostCheck: true,
    clientLogLevel: 'error',
    stats: {
      color: true,
      warningsFilter: /export .* was not found in/
    },
  },
};

function sortChunks(a: HtmlWebpackPlugin.Chunk, b: HtmlWebpackPlugin.Chunk) {
  const order = ['app', 'shared', 'vendor', 'manifest'];
  return order.indexOf(b.names[0]) - order.indexOf(a.names[0]);
}
