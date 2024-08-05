const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const isDev = env.mode === "development";

  return {
    mode: env.mode ?? "development",
    entry: path.resolve(__dirname, "scripts", "main.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    devtool: isDev ? "inline-source-map" : false,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
        favicon: path.resolve(__dirname, "src", "favicon.ico"),
      }),
      isDev && new webpack.ProgressPlugin(),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash].css",
        }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src"),
            to: path.resolve(__dirname, "dist", "src"),
          },
        ],
      }),
    ].filter(Boolean),
    devServer: {
      port: env.port ?? 3000,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
  };
};
