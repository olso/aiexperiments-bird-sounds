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
var webpack = require("webpack");

var PROD = process.env.NODE_ENV === "production";

module.exports = {
	context: __dirname,
	entry: {
		Main: "app/Main",
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		root: __dirname,
		modulesDirectories : [
			"node_modules",
			"third_party/",
			"app",
			"node_modules/tone/"
		],
	},
	plugins: PROD ? [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false, // ...but do not show warnings in the console (there is a lot of them)
			}
		}),
	] : [],
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader"
			}
		],
		loaders: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: "style!css!autoprefixer!sass"
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			{
				test: /\.(png|gif)$/,
				loader: "url-loader",
			},
			{
				test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader : "file-loader?name=images/font/[hash].[ext]"
			}
		]
	},
	node: {
		fs: "empty",
	},
	target: "web",
	watch: !PROD

};
