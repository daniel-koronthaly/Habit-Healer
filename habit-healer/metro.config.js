const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("ttf");
defaultConfig.resolver.assetExts.push("cjs");
defaultConfig.resolver.sourceExts.push('mjs');
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;