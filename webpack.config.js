const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
	entry: "./public/index.js",
	output: {
		path: __dirname + "/dist",
		filename: "[name].bundle.js",
	},
	mode: "development",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	plugins: [
		new WebpackPwaManifest({
			fingerprints: false,
			name: "Online and Offline Budget Tracker App",
			short_name: "budget-tracker ",
			description:
				"An application that allows you to keep track of your budget.",
			background_color: "#01579b",
			theme_color: "#ffffff",
			"theme-color": "#ffffff",
			start_url: "/",
			icons: [
				{
					src: path.resolve("public/icons/icon-192x192.png"),
					sizes: [192, 512],
					destination: path.join("public", "icons"),
				},
			],
		}),
	],
};

module.exports = config;
