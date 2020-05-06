const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    cpu: path.resolve('cpu-version/entry.js'),
    gpu: path.resolve('gpu-version/entry.js')
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'glsl-shader-loader',
            options: {}
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 9001,
    publicPath: '/dist/',
    contentBase: path.resolve('./'),
    compress: true,
    open: true,
    watchContentBase: true
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist')
  }
}