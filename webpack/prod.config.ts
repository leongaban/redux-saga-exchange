import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { commonPlugins, commonScssLoaders, commonRules, commonConfig } from './common';

const rules = commonRules.concat([
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
  },
  {
    test: /\.scss$/,
    use: ([MiniCssExtractPlugin.loader] as webpack.Loader[]).concat(commonScssLoaders),
  },
]);

const plugins = commonPlugins.concat([
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
  }),
]);

const prodConfig: webpack.Configuration = {
  ...commonConfig,
  mode: 'production',
  optimization: {
    ...commonConfig.optimization,
    minimize: true,
  },
  entry: {
    app: './index.tsx',
  },
  module: {
    rules,
  },
  plugins,
};

export default prodConfig;
