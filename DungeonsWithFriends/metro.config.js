const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });
const defaultResolveRequest = config.resolver.resolveRequest;
const webCommonJsAliases = new Map([
  ["zustand", require.resolve("zustand")],
  ["zustand/middleware", require.resolve("zustand/middleware")],
]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && webCommonJsAliases.has(moduleName)) {
    return {
      type: "sourceFile",
      filePath: webCommonJsAliases.get(moduleName),
    };
  }

  const resolver = defaultResolveRequest ?? context.resolveRequest;
  return resolver(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
