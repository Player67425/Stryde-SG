const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Add exclusions for problematic directories that may interfere with Metro bundler
config.resolver.blacklistRE = exclusionList([
  /C:\\Users\\timhe\\AppData\\Local\\Respondus\\Cache.*/,
  /C:\\Users\\timhe\\AppData\\Local\\Razer\\RazerAxon.*/,
]);

module.exports = config;
