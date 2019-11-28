const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const builtinModules = require('builtin-modules');

const providedModulesByNode = {}
builtinModules.forEach(nodeModule => {
  providedModulesByNode[nodeModule] = 'empty';
})
providedModulesByNode['console'] = false;
providedModulesByNode['process'] = false;

function prepareWebpackConfig(entryPoint) {
  return {
    mode: "production",
    entry: entryPoint,
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    node: providedModulesByNode,
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