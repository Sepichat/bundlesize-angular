const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const builtinModules = require('builtin-modules');
const escape = require('escape-string-regexp');

const providedModulesByNode = {}
builtinModules.forEach(nodeModule => {
  providedModulesByNode[nodeModule] = 'empty';
})
providedModulesByNode['console'] = false;
providedModulesByNode['process'] = false;

function prepareWebpackConfig({entryPoint, missingModules}) {
  const missingModulesRegex = prepareMissingModulesRegex(missingModules);
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
    },
    externals: missingModules.length ? 
      function(context, request , callback) {
        if (missingModulesRegex.test(request)){
          return callback(null, 'commonjs ' + request);
        }
        callback();
      } : []
  }
}

function prepareMissingModulesRegex(missingModules) {
  if (missingModules.length) {
    return new RegExp(
      missingModules.map((missingModule) => `^${escape(missingModule)}$`).join('|')
    );
  }
  return null;
}

module.exports = prepareWebpackConfig;