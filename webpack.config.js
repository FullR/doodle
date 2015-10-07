var path = require("path");

function ext() {
  return new RegExp("\\.(?:" + [].slice.call(arguments).join("|") + ")$");
}

function local(localpath) {
  return path.resolve(path.join(__dirname, localpath ? ("/" + localpath) : ""));
}

module.exports = {
  entry: local("src/entry.js"),
  output: {
    path: local("public"),
    filename: "app.js"
  },
  resolve: {
    root: [local("src")],
    extentions: ["", ".js"]
  },
  module: {
    loaders: [
      {test: ext("js"), exclude: /node_modules/, loader: "babel-loader?stage=0"},
      {test: ext("json"), loader: "json"},
      {test: ext("html"), loader: "file?name=[name].[ext]"},
      {test: ext("scss"), loader: "style!css!autoprefixer!sass"}
    ]
  },
  devServer: {
    colors: true,
    //progress: true,
    port: 9090,
    proxy: {
      "*": "http://localhost:8081"
    }
  }
};
