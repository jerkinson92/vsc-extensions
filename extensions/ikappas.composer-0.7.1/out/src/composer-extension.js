/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const settings_1 = require("./helpers/settings");
const strings_1 = require("./helpers/strings");
const constants_1 = require("./helpers/constants");
const composer_context_1 = require("./contexts/composer-context");
const commands_1 = require("./helpers/commands");
class ComposerExtension extends vscode_1.Disposable {
    constructor() {
        super(() => {
            this.disposables.map((d) => { d.dispose(); });
            this.channel.dispose();
        });
        this.contexts = new Map();
        this.disposables = [];
        this.channel = vscode_1.window.createOutputChannel(constants_1.Constants.OutputChannel);
        this.initializeExtension();
        // Add the event listener for settings changes, then re-initialized the extension
        vscode_1.workspace.onDidChangeConfiguration(() => {
            this.reinitialize();
        });
        // Add the event listener for workspace changes, then re-initialized the extension
        vscode_1.workspace.onDidChangeWorkspaceFolders(() => {
            this.reinitialize();
        });
    }
    // Reinitialize the extension when coming back online
    reinitialize() {
        this.disposables.map((d) => { d.dispose(); });
        this.initializeExtension();
    }
    initializeExtension() {
        this.contexts.clear();
        let globalSettings = new settings_1.ComposerSettings();
        if (globalSettings.enabled && vscode_1.workspace.workspaceFolders) {
            // Process each workspace folder
            for (let folder of vscode_1.workspace.workspaceFolders) {
                let context = new composer_context_1.ComposerContext(folder);
                context.onDidChangeClient(e => {
                    this.disposables.push(e.client.onOutput(o => { this.channel.append(o); }));
                });
                this.contexts.set(folder.uri, context);
            }
        }
        this.registerCommands();
    }
    /**
     * Initialize Command handlers.
     */
    registerCommands() {
        this.registerCommand(commands_1.CommandNames.About, this.commandAbout);
        this.registerCommand(commands_1.CommandNames.Archive, this.ensureComposerProject(this.commandArchive));
        this.registerCommand(commands_1.CommandNames.ClearCache, this.commandClearCache);
        this.registerCommand(commands_1.CommandNames.Diagnose, this.commandDiagnose);
        this.registerCommand(commands_1.CommandNames.DumpAutoload, this.commandDumpAutoload);
        this.registerCommand(commands_1.CommandNames.Install, this.ensureComposerProject(this.commandInstall));
        this.registerCommand(commands_1.CommandNames.Remove, this.ensureComposerProject(this.commandRemove));
        this.registerCommand(commands_1.CommandNames.Require, this.ensureComposerProject(this.commandRequire));
        this.registerCommand(commands_1.CommandNames.RunScript, this.ensureComposerProject(this.commandRunScript));
        this.registerCommand(commands_1.CommandNames.SelfUpdate, this.commandSelfUpdate);
        this.registerCommand(commands_1.CommandNames.Show, this.commandShow);
        this.registerCommand(commands_1.CommandNames.Status, this.ensureComposerProject(this.commandStatus));
        this.registerCommand(commands_1.CommandNames.Update, this.ensureComposerProject(this.commandUpdate));
        this.registerCommand(commands_1.CommandNames.Validate, this.ensureComposerProject(this.commandValidate));
        this.registerCommand(commands_1.CommandNames.Version, this.commandVersion);
    }
    commandAbout(context) {
        this.reportExecutionResult(context.client.about());
    }
    commandArchive(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerArchiveInput, placeHolder: strings_1.Strings.ComposerArchivePlaceHolder }).then(pkg => {
            if (typeof (pkg) !== 'undefined') {
                let args = (pkg !== String.Empty)
                    ? pkg.split(String.Space)
                    : [];
                this.reportExecutionResult(context.client.archive.apply(context.client, args));
            }
        });
    }
    commandClearCache(context) {
        this.reportExecutionResult(context.client.clearCache());
    }
    commandDiagnose(context) {
        this.reportExecutionResult(context.client.diagnose());
    }
    commandDumpAutoload(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerDumpAutoloadInput, placeHolder: strings_1.Strings.ComposerDumpAutoloadPlaceHolder }).then(options => {
            if (typeof (options) !== 'undefined') {
                let args = (options !== String.Empty)
                    ? options.split(String.Space)
                    : [];
                this.reportExecutionResult(context.client.dumpAutoload.apply(context.client, args));
            }
        });
    }
    commandInstall(context) {
        this.reportExecutionResult(context.client.install());
    }
    commandRemove(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerRemoveInput, placeHolder: strings_1.Strings.ComposerRemovePlaceHolder }).then(options => {
            if (typeof (options) !== 'undefined' && options !== String.Empty) {
                let args = options.split(String.Space);
                this.reportExecutionResult(context.client.remove.apply(context.client, args));
            }
        });
    }
    commandRequire(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerRequireInput, placeHolder: strings_1.Strings.ComposerRequirePlaceHolder }).then(options => {
            if (typeof (options) !== 'undefined' && options !== String.Empty) {
                let args = options.split(String.Space);
                this.reportExecutionResult(context.client.require.apply(context.client, args));
            }
        });
    }
    commandRunScript(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerRunScriptInput, placeHolder: strings_1.Strings.ComposerRunScriptPlaceHolder }).then(options => {
            if (typeof (options) !== 'undefined' && options !== String.Empty) {
                let args = options.split(String.Space);
                this.reportExecutionResult(context.client.runScript.apply(context.client, args));
            }
        });
    }
    commandSelfUpdate(context) {
        this.reportExecutionResult(context.client.selfUpdate());
    }
    commandShow(context) {
        vscode_1.window.showInputBox({ prompt: strings_1.Strings.ComposerShowInput, placeHolder: strings_1.Strings.ComposerShowPlaceHolder }).then(options => {
            if (typeof (options) !== 'undefined') {
                let args = (options !== String.Empty)
                    ? options.split(String.Space)
                    : [];
                this.reportExecutionResult(context.client.show.apply(context.client, args));
            }
        });
    }
    commandStatus(context) {
        this.reportExecutionResult(context.client.status());
    }
    commandUpdate(context) {
        this.reportExecutionResult(context.client.update());
    }
    commandValidate(context) {
        this.reportExecutionResult(context.client.validate());
    }
    commandVersion(context) {
        this.reportExecutionResult(context.client.version());
    }
    /**
     * Ensure that the callback will have a composer context.
     * @param callback A composer command handler.
     */
    ensureComposerContext(callback) {
        return (context, ...args) => {
            switch (this.contexts.size) {
                case 0:
                    vscode_1.window.showInformationMessage(strings_1.Strings.ComposerContextRequired);
                    break;
                case 1:
                    context = this.contexts.values().next().value;
                    args.unshift(context);
                    return callback.apply(this, args);
                default:
                    vscode_1.window.showWorkspaceFolderPick({ placeHolder: strings_1.Strings.WorkspaceFolderPick }).then((folder) => {
                        const context = this.contexts.get(folder.uri);
                        if (context) {
                            args.unshift(context);
                            return callback.apply(this, args);
                        }
                    });
            }
        };
    }
    /**
     * Safely execute a composer command handler.
     * @param callback A composer command handler.
     */
    safeExecute(callback) {
        return (context, ...args) => {
            try {
                this.channel.show();
                args.unshift(context);
                return callback.apply(this, args);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(error.message);
            }
        };
    }
    ensureComposerProject(callback) {
        return (context, ...args) => {
            if (context.isComposerProject()) {
                args.unshift(context);
                return callback.apply(this, args);
            }
            vscode_1.window.showInformationMessage(strings_1.Strings.ComposerProjectRequired);
        };
    }
    reportExecutionResult(result) {
        result.then(() => {
            if (this.channel) {
                this.channel.appendLine(strings_1.Strings.CommandCompletedSuccessfully + '\n');
            }
        }, () => {
            if (this.channel) {
                this.channel.appendLine(strings_1.Strings.CommandCompletedWithErrors + '\n');
            }
        });
    }
    /**
     * Registers a command that can be invoked via a keyboard shortcut,
     * a menu item, an action, or directly.
     *
     * Registering a command with an existing command identifier twice
     * will cause an error.
     *
     * @param command A unique identifier for the command.
     * @param callback A command handler function.
     * @param thisArg The `this` context used when invoking the handler function.
     */
    registerCommand(command, callback, thisArg) {
        let contextCallback = this.ensureComposerContext(this.safeExecute(callback));
        this.disposables.push(vscode_1.commands.registerCommand(command, contextCallback, thisArg));
    }
}
exports.ComposerExtension = ComposerExtension;
//# sourceMappingURL=composer-extension.js.map