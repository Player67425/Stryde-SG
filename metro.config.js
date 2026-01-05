const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add exclusions for problematic directories that may interfere with Metro bundler
// These patterns exclude system directories that may cause EPERM errors
config.resolver.blockList = [
  // Respondus directories (exam proctoring software)
  /.*[\/\\]AppData[\/\\]Local[\/\\]Respondus[\/\\].*/,
  // Razer directories (gaming software)
  /.*[\/\\]AppData[\/\\]Local[\/\\]Razer[\/\\].*/,
  // Generic AppData exclusions that often cause issues
  /.*[\/\\]AppData[\/\\]Local[\/\\]Temp[\/\\].*/,
];

// Limit Metro to only watch the project directory
config.watchFolders = [__dirname];

module.exports = config;
