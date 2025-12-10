const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: { asar: true, platform: ["darwin", "win32"] },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        format: "ULFO",
        name: "ILR File Creator",
        // background: "./assets/dmg-background.png",
        // icon: "./assets/icon.icns",
        overwrite: true,
        additionalDMGOptions: {
          window: { size: { width: 660, height: 400 } },
          contents: [
            { x: 180, y: 170, type: "file", path: "/path/to/app" },
            { x: 480, y: 170, type: "link", path: "/Applications" }
          ]
        }
      }
    },
    { name: "@electron-forge/maker-zip", platforms: ["win32"] },
  ],
  plugins: [
    { name: "@electron-forge/plugin-auto-unpack-natives", config: {} },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
