'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const path = require("path");
const commands_1 = require("./commands");
const constants_1 = require("./constants");
const multimanifestmodule_1 = require("./multimanifestmodule");
const authextension_1 = require("./authextension");
const statusMessages_1 = require("./statusMessages");
const DepOutputChannel_1 = require("./DepOutputChannel");
let lspClient;
let diagCountInfo, onFileOpen = [], caNotif = false;
function activate(context) {
    let disposableFullStack = vscode.commands.registerCommand(commands_1.Commands.TRIGGER_FULL_STACK_ANALYSIS, (uri) => {
        // uri will be null in case user have use context menu/file explorer
        const fileUri = uri ? uri : vscode.window.activeTextEditor.document.uri;
        multimanifestmodule_1.multimanifestmodule.dependencyAnalyticsReportFlow(context, fileUri);
    });
    let disposableStackLogs = vscode.commands.registerCommand(commands_1.Commands.TRIGGER_STACK_LOGS, () => {
        if (exports.outputChannelDep) {
            exports.outputChannelDep.showOutputChannel();
        }
        else {
            vscode.window.showInformationMessage(statusMessages_1.StatusMessages.WIN_SHOW_LOGS);
        }
    });
    // show welcome message after first install or upgrade
    showUpdateNotification(context);
    authextension_1.authextension.authorize_f8_analytics(context).then(data => {
        if (data) {
            // Create output channel
            exports.outputChannelDep = initOutputChannel();
            // The server is implemented in node
            let serverModule = context.asAbsolutePath(path.join('node_modules/fabric8-analytics-lsp-server', 'server.js'));
            // The debug options for the server
            // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
            let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
            // If the extension is launched in debug mode then the debug server options are used
            // Otherwise the run options are used
            let serverOptions = {
                run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
                debug: {
                    module: serverModule,
                    transport: vscode_languageclient_1.TransportKind.ipc,
                    options: debugOptions
                }
            };
            // Options to control the language client
            let clientOptions = {
                // Register the server for xml, json documents
                documentSelector: [
                    { scheme: 'file', language: 'json' },
                    { scheme: 'file', language: 'xml' },
                    { scheme: 'file', language: 'plaintext' },
                    { scheme: 'file', language: 'pip-requirements' }
                ],
                synchronize: {
                    // Synchronize the setting section 'dependencyAnalyticsServer' to the server
                    configurationSection: 'dependencyAnalyticsServer',
                    // Notify the server about file changes to '.clientrc files contained in the workspace
                    fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
                }
            };
            // Create the language client and start the client.
            lspClient = new vscode_languageclient_1.LanguageClient('dependencyAnalyticsServer', 'Dependency Analytics Language Server', serverOptions, clientOptions);
            lspClient.onReady().then(() => {
                lspClient.onNotification('caNotification', respData => {
                    if (respData &&
                        respData.hasOwnProperty('diagCount') &&
                        vscode.window.activeTextEditor &&
                        ((respData.diagCount > 0 && respData.diagCount !== diagCountInfo) ||
                            !onFileOpen ||
                            (onFileOpen &&
                                onFileOpen.indexOf(vscode.window.activeTextEditor.document.fileName) === -1))) {
                        diagCountInfo = respData.diagCount;
                        onFileOpen.push(vscode.window.activeTextEditor.document.fileName);
                        showInfoOnfileOpen(respData.data);
                    }
                    if (!caNotif) {
                        vscode.window.withProgress({
                            location: vscode.ProgressLocation.Window,
                            title: statusMessages_1.StatusMessages.EXT_TITLE
                        }, progress => {
                            caNotif = true;
                            progress.report({
                                message: 'Checking for security vulnerabilities ...'
                            });
                            setTimeout(() => {
                                progress.report({
                                    message: respData.data
                                });
                            }, 1000);
                            let p = new Promise(resolve => {
                                setTimeout(() => {
                                    caNotif = false;
                                    resolve();
                                }, 1600);
                            });
                            return p;
                        });
                    }
                });
            });
            context.subscriptions.push(lspClient.start(), disposableFullStack, disposableStackLogs);
        }
    });
    let showInfoOnfileOpen = (msg) => {
        vscode.window
            .showInformationMessage(`${msg}.`, 'Dependency Analytics Report ...')
            .then((selection) => {
            if (selection === 'Dependency Analytics Report ...') {
                vscode.commands.executeCommand(commands_1.Commands.TRIGGER_FULL_STACK_ANALYSIS);
            }
        });
    };
}
exports.activate = activate;
function initOutputChannel() {
    const outputChannelDepInit = new DepOutputChannel_1.DepOutputChannel();
    return outputChannelDepInit;
}
exports.initOutputChannel = initOutputChannel;
function deactivate() {
    if (!lspClient) {
        return undefined;
    }
    onFileOpen = [];
    return lspClient.stop();
}
exports.deactivate = deactivate;
function showUpdateNotification(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrive current and previous version string to show welcome message
        const packageJSON = vscode.extensions.getExtension(constants_1.extensionQualifiedId).packageJSON;
        const version = packageJSON.version;
        const previousVersion = context.globalState.get(constants_1.GlobalState.Version);
        // Nothing to display
        if (version === previousVersion)
            return;
        // store current version into localStorage
        context.globalState.update(constants_1.GlobalState.Version, version);
        const actions = [{ title: 'README' }, { title: 'Release Notes' }];
        const displayName = packageJSON.displayName;
        const result = yield vscode.window.showInformationMessage(`${displayName} has been updated to v${version} — check out what's new!`, ...actions);
        if (result != null) {
            if (result === actions[0]) {
                yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(packageJSON.homepage));
            }
            else if (result === actions[1]) {
                yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${packageJSON.repository.url}/releases/tag/${version}`));
            }
        }
    });
}
//# sourceMappingURL=extension.js.map