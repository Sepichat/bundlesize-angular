const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  entry: '../../node_modules/react/',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          compress: {
            drop_console: true,
            ecma: 6
          }
        }
      }),

    ]
  }
};