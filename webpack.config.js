/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
Terminal Commands:
webpack-dev-server to run on localhost:8080
webpack -p to compile builds
*/
const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appBuild = resolveApp("build");
const appPublic = resolveApp("public");
const appSrc = resolveApp("app");
const appIndexJs = resolveApp("app/Main.js");
const appHtml = resolveApp("public/index.html");
const PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    main: appIndexJs
  },
  devServer: {
    compress: true,
    clientLogLevel: "none",
    contentBase: appPublic,
    watchContentBase: true,
    hot: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },

  output: {
    path: appBuild,
    filename: !PROD ? "static/js/[name].js" : "static/js/[name].[hash:8].js",
    chunkFilename: !PROD
      ? "static/js/[name].chunk.js"
      : "static/js/[name].[chunkhash:8].chunk.js"
  },
  resolve: {
    modules: ["node_modules", "node_modules/tone/"]
  },
  plugins: [
    new CleanWebpackPlugin([appBuild]),
    PROD
      ? new CopyWebpackPlugin(
          [
            {
              from: appPublic,
              to: appBuild
            }
          ],
          {
            ignore: ["index.html"]
          }
        )
      : () => {},
    PROD
      ? new ExtractTextPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          allChunks: true
        })
      : () => {},
    new HtmlWebpackPlugin({
      inject: true,
      template: appHtml,
      minify: PROD
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        : false
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    PROD
      ? new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebookincubator/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          output: {
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebookincubator/create-react-app/issues/2488
            ascii_only: true
          },
          sourceMap: false
        })
      : () => {}
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        loader: "eslint-loader",
        include: appSrc
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            include: appSrc,
            loader: "babel-loader",
            options: !PROD ? { cacheDirectory: true } : {}
          },
          {
            test: /\.css$/,
            use: !PROD
              ? [
                  "style-loader",
                  {
                    loader: "css-loader",
                    options: {
                      importLoaders: 1
                    }
                  },
                  {
                    loader: "postcss-loader",
                    options: {
                      ident: "postcss"
                    }
                  }
                ]
              : ExtractTextPlugin.extract(
                  Object.assign({
                    fallback: {
                      loader: "style-loader",
                      options: {
                        hmr: false
                      }
                    },
                    use: [
                      {
                        loader: "css-loader",
                        options: {
                          importLoaders: 1,
                          minimize: true,
                          sourceMap: false
                        }
                      },
                      {
                        loader: "postcss-loader",
                        options: {
                          ident: "postcss"
                        }
                      }
                    ]
                  })
                )
          },
          {
            test: /\.(png|gif)$/,
            loader: "url-loader"
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  performance: {
    hints: false
  },
  bail: PROD,
  cache: !PROD,
  devtool: !PROD ? "cheap-module-eval-source-map" : false
};
