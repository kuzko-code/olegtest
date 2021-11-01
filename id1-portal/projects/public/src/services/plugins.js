const context = require.context("../plugins", true, /\.\/\w+\/index.js$/);

const plugins = context.keys().map(function (key) {
  const name = key.split("/")[1];
  return { name, pages: context(key).default };
});

export default plugins