const webpack = require("webpack");
const path = require("path");
// const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = () => {
  return {
    entry: {
      main: "./src/js/script.js",
      materialize: "./src/js/materialize.js",
    },
    output: {
      // filename: ".packed.js",
      path: path.resolve(__dirname, "static", "js"),
    },
    mode: "production",
    optimization: {
      usedExports: true,
    },
    devtool: "source-map",
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["env"],
            },
          },
        },
      ],
    },
  };
};
