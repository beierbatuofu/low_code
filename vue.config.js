const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const devServerPort = 8080;
const VUE_APP_VERSION = require("./package.json").version;
const CompressionPlugin = require("compression-webpack-plugin");

const maxSize = 300000;
const minSize = 250000;
function resolve(dir) {
	// __dirname 项目根目录的绝对路径
	return path.join(__dirname, dir);
}
process.env.VUE_APP_VERSION = `
     ver:${VUE_APP_VERSION} ${new Date().getFullYear()}-${Number(new Date().getMonth()) + 1}-${new Date().getDate()}-${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}
`;

const baseUrl = process.env.VUE_APP_BASE_URL;

module.exports = {
	productionSourceMap: false,
	publicPath: baseUrl,
	lintOnSave: process.env.NODE_ENV === "development",
	filenameHashing: false,
	devServer: {
		port: devServerPort,
		open: true,
		compress: true,
		hot: true,
		progress: false,
		// proxy: {
		//   '/': {
		//     target: `http://10.10.8.83:9081/`, //测试http://10.10.8.83:9081
		//     changeOrigin: true, // needed for virtual hosted sites
		//   },
		// }
	},

	pluginOptions: {
		"style-resources-loader": {
			preProcessor: "scss",
			patterns: [path.resolve(__dirname, "src/styles/variables.scss"), path.resolve(__dirname, "src/styles/mixins.scss")],
		},
	},

	chainWebpack(config) {
		config.resolve.alias
			.set("@src", path.resolve("src"))
			.set("@rfield", path.resolve("src/components/rfield"))
			.set("@formDesign", path.resolve("src/components/formDesign"))
			.set("@rvue", path.resolve("src/components/rvue"))
			.set("@utils", path.resolve("src/utils"))
			.set("@core", path.resolve("src/core"));

		config.module.rule("svg").exclude.add(resolve("src/icons"));

		config.module
			.rule("icons")
			.test(/\.(svg)(\?.*)?$/)
			.include.add(resolve("src/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({ symbolId: "icon-[name]" });

		config.plugin("preload").tap(() => [
			{
				rel: "preload",
				fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
				include: "initial",
			},
		]);

		if (process.env.use_analyzer == "analyzer") {
			config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
		}

		//sass中注入环境变量
		config.module.rule("scss").oneOfs.store.forEach((item) => {
			item.use("sass-loader")
				.loader("sass-loader")
				.options({
					additionalData: "$env: '" + baseUrl + "';",
				})
				.end();
		});

		config.when(process.env.NODE_ENV !== "development", (config) => {
			config.optimization.splitChunks({
				maxAsyncRequests: 5,
				maxInitialRequests: 3,
				automaticNameDelimiter: ".",
				chunks: "all",
				minSize: 600000,
				maxSize: 600001,
				cacheGroups: {
					elementui: {
						name: "element-ui",
						test: (module) => /node_modules\/_element-ui/g.test(module.context),
						priority: 90,
						minChunks: 1,
						maxSize: 9999999,
						filename: "js/element-ui.bundle.js",
					},
					echart: {
						name: "echart",
						test: (module) => /node_modules\/_echarts/g.test(module.context),
						priority: 100,
						minChunks: 1,
						maxSize: 9999999,
						filename: "js/echart.bundle.js",
					},
				},
			});

			config.plugin("compressionPlugin").use(
				new CompressionPlugin({
					test: /\.js$|\.html$|\.css$/,
					algorithm: "gzip",
					threshold: 10240,
					deleteOriginalAssets: false,
				})
			);

			//	config.optimization.runtimeChunk("single");
			if (process.env.VUE_APP_ENV == "production") {
				config.optimization.minimizer("terser").tap((args) => {
					// 注释console.*
					args[0].terserOptions.compress["drop_console"] = true;
					// remove debugger
					args[0].terserOptions.compress["drop_debugger"] = true;
					// 移除 console.log
					// args[0].terserOptions.compress['pure_funcs'] = ['console.log'];
					// 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
					args[0].terserOptions.output = {
						comments: false,
					};
					return args;
				});
			}
		});
	},
	configureWebpack: (config) => {
		config.plugins[8].options.title = "聆风";
		config.devtool = process.env.VUE_APP_DEBUGGER == "test" ? "cheap-eval-source-map" : "none";
		if (process.env.NODE_ENV === "production") {
			config.performance = {
				hints: false,
			};

			// config.plugins.push(

			// );

			// config.output = {
			// 	...config.output,
			// 	filename: "js/[name].js?ver=[hash]",
			// 	chunkFilename: "js/[name].js?ver=[hash]",
			// };
			// config.plugins[4].options = {
			// 	...config.plugins[4].options,
			// 	filename: `css/[name].css?ver=[hash]`,
			// 	chunkFilename: `css/[name].css?ver=[hash]`,
			// };
			try {
				/**
				 * @description:打包速度优化，先运行npm run dll拆分dependencies依赖
				 * todo 拆分的太多体积大小会变大
				 */
				const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
				const sPath = "./dependencies";
				const dlls = [];
				const files = fs.readdirSync(sPath);
				files.forEach((n, idx) => {
					if (/\.json$/.test(n)) {
						const manifest = require(path.join(__dirname, sPath, n));
						dlls.push(new webpack.DllReferencePlugin({ manifest }));
					}
					if (/\.js$/.test(n)) {
						dlls.push(
							new AddAssetHtmlPlugin({
								// dll文件位置
								filepath: path.resolve(__dirname, `dependencies/${n}`),
								// dll 引用路径
								publicPath: `${baseUrl}dependencies`,
								// dll最终输出的目录
								outputPath: `dependencies`,
							})
						);
					}
				});
				const configPlugins = config.plugins;
				config.plugins = [...configPlugins, ...dlls];
			} catch (err) {
				console.log("please run webpack.dll.conf.js");
			}
		}
	},
};
