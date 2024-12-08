const path = require('path');

module.exports = {
  entry: {
    main: './src/fetchHelper.js',
    anotherExample: './examples/anotherexample.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // The following three lines ensure that when you load main.bundle.js from a script tag,
    // it will expose a global variable `fetchHelper`.
    library: 'fetchHelper',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'development',
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
};
