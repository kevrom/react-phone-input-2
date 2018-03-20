const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const TARGET = process.env.TARGET;
const ROOT_PATH = path.resolve(__dirname);
const nodeModulesDir = path.join(ROOT_PATH, 'node_modules');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let envs = {};

//Common configuration settings
envs.common = {
  entry: './src',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', path.resolve(__dirname, './src')]
  },
  output: {
    path: path.resolve(ROOT_PATH, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: path.resolve(ROOT_PATH, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.png.*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              mimetype: 'image/png'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
};

//Development configuration settings
envs.dev = merge(envs.common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    publicPath: 'http://localhost:8181/',
    port: '8181',
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: 'dist',
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      '__DEV__': true
    })
  ]
});

//Production configuration settings
envs.build = merge(envs.common, {
  output: {
    path: path.resolve(ROOT_PATH, 'dist'),
    filename: 'index.js',
    library: 'ReactPhoneInput',
    libraryTarget: 'umd'
  },
  externals: [{
    'lodash': 'lodash',
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'ReactDOM',
      commonjs: 'ReactDOM',
      amd: 'ReactDOM'
    }
  }],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      '__DEV__': false
    })
  ]
});

envs.analyze = merge(envs.build, {
  plugins: [
    new BundleAnalyzer()
  ]
});

module.exports = envs[TARGET];
