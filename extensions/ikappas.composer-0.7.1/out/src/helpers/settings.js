/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
class SettingNames {
}
SettingNames.SettingsPrefix = constants_1.Constants.ExtensionName + '.';
SettingNames.Enabled = SettingNames.SettingsPrefix + 'enabled';
SettingNames.ExecutablePath = SettingNames.SettingsPrefix + 'executablePath';
SettingNames.WorkingPath = SettingNames.SettingsPrefix + 'workingPath';
exports.SettingNames = SettingNames;
class BaseSettings {
    /**
     * Class constructor.
     * @param resource The resource for which the settings apply.
     */
    constructor(resource = undefined) {
        this._resource = resource;
    }
    /**
     * Get the resource for which the settings apply.
     */
    get resource() {
        return this._resource;
    }
    /**
     * Read the setting.
     *
     * @param name The name of the setting.
     * @param defaultValue The default value for the setting.
     */
    readSetting(name, defaultValue) {
        let config;
        if (this.resource === null || this.resource === undefined) {
            // Reading Window scoped configuration
            config = vscode_1.workspace.getConfiguration('', null);
        }
        else {
            // Reading Resource scoped configuration
            config = vscode_1.workspace.getConfiguration('', this.resource);
        }
        let value = config.get(name, undefined);
        // If user specified a value, use it
        if (value !== undefined && value !== null) {
            return value;
        }
        return defaultValue;
    }
}
class ComposerSettings extends BaseSettings {
    constructor(resource = null) {
        super(resource);
        this._enabled = this.readSetting(SettingNames.Enabled, true);
        this._executablePath = this.readSetting(SettingNames.ExecutablePath, undefined);
        this._workingPath = this.readSetting(SettingNames.WorkingPath, undefined);
    }
    get enabled() {
        return this._enabled;
    }
    get executablePath() {
        return this._executablePath;
    }
    get workingPath() {
        return this._workingPath;
    }
}
exports.ComposerSettings = ComposerSettings;
//# sourceMappingURL=settings.js.map