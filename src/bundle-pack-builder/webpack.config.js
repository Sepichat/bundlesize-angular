const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

function prepareWebpackConfig(entryPoint) {
  return {
    mode: "production",
    entry: entryPoint,
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
          },
          extractComments: true,
        }),
  
      ]
    }
  }
}

module.exports = prepareWebpackConfig;