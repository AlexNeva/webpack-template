const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

module.exports = (env) => {
  const mode = env.production ? "production" : "development";
  const devMode = mode === "development";
  const target = devMode ? "web" : "browserslist";
  const devtool = devMode && "source-map";

  return {
    mode,
    target,
    devtool,
    entry: path.resolve(__dirname, "src", "index.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      clean: true,
      filename: "index.[contenthash].js",
      publicPath: "/",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
        inject: "body",
        inlineSource: ".(js|css)$",
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  };
};
