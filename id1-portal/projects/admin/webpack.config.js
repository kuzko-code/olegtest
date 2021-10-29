const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/build"),
    filename: "index-bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css|.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],

      },
      {
        test: /\.(gif|png|jpe?g|svg|ttf|woff|woff2|eot)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: true
            }
          }
        ]
      }
      // {
      //   test: /\.ttf$/,
      //     use: [
      //       {
      //         loader: 'ttf-loader',
      //       },
      //     ]
      // },
    ]
  },
  devServer: {
    historyApiFallback: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new Dotenv({
      systemvars: true,
      silent: true,
      defaults: true
    }),
    new CopyPlugin([
      { from: "src/plugins/**/*.png", to: "public" },
      { from: "src/plugins/**/*.jpg", to: "public" },
      { from: "public", to: "public" },
      {
        from: "node_modules/tinymce/skins",
        to: "skins"
      },
      {
        from: "src/plugins/**/tiny-mce-languages/*.js",
        to: "./public/tiny-mce-languages/[name].[ext]"
      },
      {
        from: "src/constants/tiny-mce-languages/*.js",
        to: "./public/tiny-mce-languages/[name].[ext]"
      }
    ])
  ]
};