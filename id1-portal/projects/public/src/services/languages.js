const context = require.context("../plugins", true, /\/translations.js$/);

const languages = context.keys().map(function(key) {   
  return {translation: context(key).default};
});

export default languages;