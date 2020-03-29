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
const fs = require("fs");
const os = require("os");
const stackanalysismodule_1 = require("./stackanalysismodule");
const authextension_1 = require("./authextension");
const statusMessages_1 = require("./statusMessages");
const dependencyReportPanel_1 = require("./dependencyReportPanel");
var multimanifestmodule;
(function (multimanifestmodule) {
    multimanifestmodule.form_manifests_payload = (resultPath) => {
        return new Promise((resolve, reject) => {
            multimanifestmodule.manifestFileRead(resultPath)
                .then(item => {
                let form_data = {
                    'manifest[]': [],
                    'filePath[]': [],
                    'license[]': [],
                    origin: 'lsp'
                };
                if (item && item['manifest'] && item['filePath']) {
                    form_data['manifest[]'].push(item['manifest']);
                    form_data['filePath[]'].push(item['filePath']);
                }
                //TODO : for logging 400 issue
                if (!item['manifest'] && !item['license']) {
                    console.log('Manifest is missed', item);
                }
                if (!item['filePath'] && !item['license']) {
                    console.log('filePath is missed', item);
                }
                resolve(form_data);
            })
                .catch(error => {
                reject(error);
            });
        });
    };
    multimanifestmodule.manifestFileRead = fsPath => {
        let form_data = {
            manifest: '',
            filePath: '',
            license: ''
        };
        let manifestObj;
        let filePath = '';
        return new Promise((resolve, reject) => {
            fs.readFile(fsPath, function (err, data) {
                if (data) {
                    manifestObj = {
                        value: '',
                        options: {
                            filename: '',
                            contentType: 'text/plain'
                        }
                    };
                    if (fsPath) {
                        let filePathSplit = /(\/target|)/g;
                        let strSplit = '/';
                        if (os.platform() === 'win32') {
                            filePathSplit = /(\\target|)/g;
                            strSplit = '\\';
                        }
                        filePath = fsPath.replace(filePathSplit, '');
                        if (filePath &&
                            typeof filePath === 'string' &&
                            filePath.indexOf('npmlist') !== -1) {
                            form_data['filePath'] = 'package.json';
                            manifestObj.options.filename = 'npmlist.json';
                            manifestObj.options.contentType = 'application/json';
                            manifestObj.value = data.toString();
                            form_data['manifest'] = manifestObj;
                        }
                        else if (filePath &&
                            typeof filePath === 'string' &&
                            filePath.indexOf('pylist.json') !== -1) {
                            form_data['filePath'] = 'requirements.txt';
                            manifestObj.options.filename = 'pylist.json';
                            manifestObj.options.contentType = 'application/json';
                            manifestObj.value = data.toString();
                            form_data['manifest'] = manifestObj;
                        }
                        else if (filePath &&
                            typeof filePath === 'string' &&
                            filePath.indexOf('dependencies.txt') !== -1) {
                            form_data['filePath'] = 'pom.xml';
                            manifestObj.options.filename = 'dependencies.txt';
                            manifestObj.options.contentType = 'text/plain';
                            manifestObj.value = data.toString();
                            form_data['manifest'] = manifestObj;
                        }
                        else {
                            form_data['filePath'] = filePath;
                            manifestObj.value = data.toString();
                            form_data['manifest'] = manifestObj;
                        }
                    }
                    resolve(form_data);
                }
                else {
                    vscode.window.showErrorMessage(err.message);
                    reject(err.message);
                }
            });
        });
    };
    /*
     * Needed async function in order to wait for user selection in case of
     * multi root projects
     */
    multimanifestmodule.dependencyAnalyticsReportFlow = (context, uri = null) => __awaiter(this, void 0, void 0, function* () {
        let workspaceFolder;
        if (uri && uri.scheme && uri.scheme === 'file') {
            if (uri.fsPath && uri.fsPath.toLowerCase().indexOf('pom.xml') !== -1) {
                workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                stackanalysismodule_1.stackanalysismodule.processStackAnalyses(context, workspaceFolder, 'maven', uri);
            }
            else if (uri.fsPath &&
                uri.fsPath.toLowerCase().indexOf('package.json') !== -1) {
                workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                stackanalysismodule_1.stackanalysismodule.processStackAnalyses(context, workspaceFolder, 'npm', uri);
            }
            else if (uri.fsPath &&
                uri.fsPath.toLowerCase().indexOf('requirements.txt') !== -1) {
                workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                stackanalysismodule_1.stackanalysismodule.processStackAnalyses(context, workspaceFolder, 'pypi', uri);
            }
            else {
                vscode.window.showInformationMessage(`File ${uri.fsPath} is not supported!!`);
            }
        }
        else if (vscode.workspace.hasOwnProperty('workspaceFolders') &&
            vscode.workspace['workspaceFolders'].length > 1) {
            let workspaceFolder = yield vscode.window.showWorkspaceFolderPick({
                placeHolder: 'Pick Workspace Folder...'
            });
            if (workspaceFolder) {
                multimanifestmodule.triggerFullStackAnalyses(context, workspaceFolder);
            }
            else {
                vscode.window.showInformationMessage(`No Workspace selected.`);
            }
        }
        else {
            let workspaceFolder = vscode.workspace.workspaceFolders[0];
            multimanifestmodule.triggerFullStackAnalyses(context, workspaceFolder);
        }
    });
    multimanifestmodule.triggerFullStackAnalyses = (context, workspaceFolder) => {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, '{pom.xml,**/package.json}');
        vscode.workspace.findFiles(relativePattern, '**/node_modules').then((result) => {
            if (result && result.length) {
                // Do not create an effective pom if no pom.xml is present
                let effective_pom_skip = true;
                let ecosystem = 'npm';
                let pom_count = 0;
                result.forEach(item => {
                    if (item.fsPath.indexOf('pom.xml') >= 0) {
                        effective_pom_skip = false;
                        pom_count += 1;
                        ecosystem = 'maven';
                    }
                });
                if (!effective_pom_skip && pom_count === 0) {
                    vscode.window.showInformationMessage('Multi ecosystem support is not yet available.');
                    return;
                }
                else {
                    stackanalysismodule_1.stackanalysismodule.processStackAnalyses(context, workspaceFolder, ecosystem);
                }
            }
            else {
                vscode.window.showInformationMessage(statusMessages_1.StatusMessages.NO_SUPPORTED_MANIFEST);
            }
        }, 
        // Other ecosystem flow
        (reason) => {
            vscode.window.showInformationMessage(statusMessages_1.StatusMessages.NO_SUPPORTED_MANIFEST);
        });
    };
    multimanifestmodule.triggerManifestWs = context => {
        return new Promise((resolve, reject) => {
            authextension_1.authextension
                .authorize_f8_analytics(context)
                .then(data => {
                if (data) {
                    dependencyReportPanel_1.DependencyReportPanel.createOrShow(context.extensionPath, null);
                    resolve(true);
                }
            })
                .catch(err => {
                reject(`Unable to authenticate.`);
            });
        });
    };
})(multimanifestmodule = exports.multimanifestmodule || (exports.multimanifestmodule = {}));
//# sourceMappingURL=multimanifestmodule.js.map