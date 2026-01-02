const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add exclusions for problematic directories that may interfere with Metro bundler
// These patterns exclude system directories that may cause EPERM errors
config.resolver.blacklistRE = exclusionList([
  // Respondus directories (exam proctoring software)
  /.*[\/\\]AppData[\/\\]Local[\/\\]Respondus[\/\\].*/,
  // Razer directories (gaming software)
  /.*[\/\\]AppData[\/\\]Local[\/\\]Razer[\/\\].*/,
  // Generic AppData exclusions that often cause issues
  /.*[\/\\]AppData[\/\\]Local[\/\\]Temp[\/\\].*/,
]);

// Limit Metro to only watch the project directory
config.watchFolders = [__dirname];

// Exclude common problematic directories from Metro's file watcher
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
