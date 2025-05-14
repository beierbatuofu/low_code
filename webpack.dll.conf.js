/*
 * @Author: ben
 * @LastEditTime: 2022-04-29 10:34:42
 * @description: 第一次打包,先运行该文件 dependencies
 */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const packages = require("./package.json").dependencies || {};
const path = require("path");

const plugins = [
	"script-loader",
	"single-spa-vue",
	"vue",
	"vue-class-component",
	"vue-grid-layout",
	"vue-i18n",
	"vue-lazyload",
	"vue-property-decorator",
	"vue-router",
	"vuedraggable",
	"vuex",
	"vuex-module-decorators",
	"axios",
	"mitt",
	"vconsole",
	"core-js",
	"html2canvas",
];

const compile = webpack({
	entry: {
		vendor: plugins,
	},
	output: {
		path: path.resolve(__dirname, "dependencies"),
		filename: `vendors.js`,
		publicPath: "/",
		library: "[name]_[hash:6]",
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DllPlugin({
			path: path.join(__dirname, "/dependencies", `vendors.json`),
			name: "[name]_[hash:6]",
		}),
	],
});

compile.run((err, stats) => {
	if (err) {
		console.log(err);
	} else {
		console.log("finished");
	}
});
