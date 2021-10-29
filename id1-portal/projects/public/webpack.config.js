const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

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
        test: /\.css|.scss$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: true
            }
          }
        ]
      },
      // {
      //   test: /\.(woff|woff2|ttf|otf|eot)$/,
      //   loader: 'file-loader',
      //   include: [/fonts/],

      //   options: {
      //     name: '[hash].[ext]',
      //     outputPath: 'css/',
      //     publicPath: url => '../css/' + url
      //   }
      // },
      {
        test: /\.(ttf|eot|woff|woff2|eot|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }
      }
      // {
      //   test: /\.(woff|woff2|ttf|eot|otf)$/,
      //   use: 'file-loader?name=fonts/[name].[ext]!static'
      //  }
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
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new Dotenv({
      systemvars: true,
      silent: true,
      defaults: true
    }),
    new CopyPlugin([{ from: "src/plugins/**/*.jpg", to: "public" }]),
    new CopyPlugin([{ from: "src/plugins/**/*.png", to: "public" }]),    
    new CopyPlugin([{ from: "public", to: "public" }])
  ]
};
