const path = require('path');

module.exports = [
  // CommonJS Build
  {
    entry: './src/fetchHelper.js',
    output: {
      filename: 'main.bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'fetchHelper',
        type: 'umd',
      },
      globalObject: 'this',
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  },
  // ESM Build
  {
    entry: './src/fetchHelper.js',
    output: {
      filename: 'main.esm.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    experiments: {
      outputModule: true,
    },
  },
];
