module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "triumf-test.js",
    clean: true,
  },
  devServer: {
    static: "./public",
    port: 8998,
    hot: true,
  },
  devtool: "inline-source-map",
};
