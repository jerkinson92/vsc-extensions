/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const settings_1 = require("../helpers/settings");
const composer_client_1 = require("../clients/composer-client");
const errors_1 = require("../helpers/errors");
const strings_1 = require("../helpers/strings");
class ComposerContext {
    /**
     * Class Constructor.
     * @param folder The target workspace folder.
     */
    constructor(folder) {
        this._onDidChangeSettings = new vscode_1.EventEmitter();
        this._onDidChangeClient = new vscode_1.EventEmitter();
        this.folder = folder;
    }
    /**
     * Get the workspace folder associated with this context.
     */
    get folder() {
        return this._folder;
    }
    /**
     * Set the workspace folder associated with this context.
     */
    set folder(folder) {
        this._folder = folder;
    }
    /**
     * Get the composer settings associated with this context.
     */
    get settings() {
        if (!this._settings) {
            this.settings = new settings_1.ComposerSettings(this.folder.uri);
        }
        return this._settings;
    }
    /**
     * Set the composer settings associated with this context.
     * @access private
     */
    set settings(settings) {
        this._settings = settings;
        this._onDidChangeSettings.fire({ settings: settings });
    }
    /**
     * An event that is emitted when a composer settings object is set.
     */
    get onDidChangeSettings() {
        return this._onDidChangeSettings.event;
    }
    /**
     * Get the composer client associated with this context.
     */
    get client() {
        if (!this._client) {
            if (!this.settings.executablePath) {
                throw new errors_1.ComposerError({
                    message: strings_1.Strings.ComposerExecutablePathRequired
                });
            }
            this.client = new composer_client_1.ComposerClient(this.settings.executablePath, this.workingPath, process.env);
        }
        return this._client;
    }
    /**
     * Set the composer client associated with this context.
     * @access private
     */
    set client(client) {
        this._client = client;
        this._onDidChangeClient.fire({ client: this._client });
    }
    /**
     * An event that is emitted when a composer client object is set.
     */
    get onDidChangeClient() {
        return this._onDidChangeClient.event;
    }
    /**
     * Get the composer working path.
     */
    get workingPath() {
        let workingPath = this.folder.uri.fsPath;
        // Process settings.
        let settingsPath = this.settings.workingPath;
        if (settingsPath !== null && settingsPath !== undefined) {
            if (path.isAbsolute(settingsPath)) {
                workingPath = settingsPath;
            }
            else {
                workingPath = path.join(workingPath, settingsPath);
            }
        }
        return workingPath;
    }
    /**
     * Get the composer.json path.
     */
    get composerJsonPath() {
        try {
            let composerJsonPath = fs.realpathSync(path.join(this.workingPath, 'composer.json'));
            fs.accessSync(composerJsonPath);
            return composerJsonPath;
        }
        catch (_a) {
            return null;
        }
    }
    /**
     * Determine whether we have a composer project.
     */
    isComposerProject() {
        try {
            return this.composerJsonPath !== null;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.ComposerContext = ComposerContext;
//# sourceMappingURL=composer-context.js.map