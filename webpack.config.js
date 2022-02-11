const MODE = "development";

const enabledSourceMap = MODE === "development";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = [
  {
    // main process
    entry: {
      "main/index": "./src/main/index.js",
    },
    output: {
      path: path.resolve(__dirname, "dist/main"),
      filename: "index.js",
    },
    target: "electron-main",
    // node: {
    //   __dirname: false,
    //   __filename: false,
    // },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
  },
  {
    entry: "./src/main/preload.js",
    output: {
      path: path.resolve(__dirname, "dist/main"),
      filename: "preload.js",
    },
    target: "electron-preload",
  },
  {
    // renderer process
    entry: {
      //   "main/index": "./src/main/index.js",
      app: "./src/renderer/App.jsx",
      captureWindow: "./src/renderer/captureWindow.js",
      previewWindow: "./src/renderer/PreviewWindow.jsx",
    },
    output: {
      path: path.resolve(__dirname, "dist/renderer"),
      filename: "[name].js",
    },
    target: "electron-renderer",
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                sourceMap: enabledSourceMap,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "/public/index.html"),
        chunks: ["app"],
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "/public/captureWindow.html"),
        chunks: ["captureWindow"],
        filename: "captureWindow.html",
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "/public/previewWindow.html"),
        chunks: ["previewWindow"],
        filename: "previewWindow.html",
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
  },
];

module.exports = config;
