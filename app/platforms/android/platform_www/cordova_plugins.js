cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.manueldeveloper.volume-buttons.volumebuttons",
    "file": "plugins/com.manueldeveloper.volume-buttons/www/volumebuttons.js",
    "pluginId": "com.manueldeveloper.volume-buttons",
    "clobbers": [
      "navigator.volumebuttons"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-background-mode.BackgroundMode",
    "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
    "pluginId": "cordova-plugin-background-mode",
    "clobbers": [
      "cordova.plugins.backgroundMode",
      "plugin.backgroundMode"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "com.manueldeveloper.volume-buttons": "0.0.3",
  "cordova-plugin-statusbar": "2.4.2",
  "cordova-plugin-device": "2.0.2",
  "cordova-plugin-background-mode": "0.7.2"
};
// BOTTOM OF METADATA
});