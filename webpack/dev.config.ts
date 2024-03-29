import * as webpack from 'webpack';

import { commonPlugins, commonScssLoaders, commonRules, commonConfig } from './common';

const withHot = !!process.env.WATCH_MODE;

const rules: webpack.Rule[] = commonRules.concat([
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.scss$/,
    use: (['style-loader'] as webpack.Loader[]).concat(commonScssLoaders),
  },
]);

const plugins: webpack.Plugin[] = commonPlugins
  .concat(withHot ? new webpack.HotModuleReplacementPlugin() : [])
  .concat(new webpack.NamedModulesPlugin());

const devConfig: webpack.Configuration = {
  ...commonConfig,
  mode: 'development',
  watch: withHot,
  entry: {
    app: ([] as string[])
      .concat(withHot ? 'react-hot-loader/patch' : [])
      .concat('./index.tsx'),
  },
  module: {
    rules,
  },
  plugins,
  devtool: 'eval',
};

export default devConfig;
