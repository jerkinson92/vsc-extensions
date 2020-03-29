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
const paths = require("path");
const apiendpoint_1 = require("./apiendpoint");
const constants_1 = require("./constants");
const multimanifestmodule_1 = require("./multimanifestmodule");
const ProjectDataProvider_1 = require("./ProjectDataProvider");
const stackAnalysisService_1 = require("./stackAnalysisService");
const statusMessages_1 = require("./statusMessages");
const dependencyReportPanel_1 = require("./dependencyReportPanel");
var stackanalysismodule;
(function (stackanalysismodule) {
    stackanalysismodule.stackAnalysesLifeCycle = (context, effectiveF8Var, argumentList) => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: statusMessages_1.StatusMessages.EXT_TITLE
        }, p => {
            return new Promise((resolve, reject) => {
                p.report({ message: statusMessages_1.StatusMessages.WIN_RESOLVING_DEPENDENCIES });
                ProjectDataProvider_1.ProjectDataProvider[effectiveF8Var](argumentList)
                    .then((dataEpom) => __awaiter(this, void 0, void 0, function* () {
                    yield multimanifestmodule_1.multimanifestmodule.triggerManifestWs(context);
                    p.report({
                        message: statusMessages_1.StatusMessages.WIN_ANALYZING_DEPENDENCIES
                    });
                    return dataEpom;
                }))
                    .then((dataEpom) => __awaiter(this, void 0, void 0, function* () {
                    let formData = yield multimanifestmodule_1.multimanifestmodule.form_manifests_payload(dataEpom);
                    return formData;
                }))
                    .then((formData) => __awaiter(this, void 0, void 0, function* () {
                    let payloadData = formData;
                    const options = {};
                    let thatContext;
                    options['uri'] = `${apiendpoint_1.Apiendpoint.STACK_API_URL}stack-analyses/?user_key=${apiendpoint_1.Apiendpoint.STACK_API_USER_KEY}`;
                    options['formData'] = payloadData;
                    options['headers'] = {
                        showTransitiveReport: 'true',
                        origin: 'vscode',
                        ecosystem: apiendpoint_1.Apiendpoint.API_ECOSYSTEM
                    };
                    thatContext = context;
                    let respId = yield stackAnalysisService_1.stackAnalysisServices.postStackAnalysisService(options, thatContext);
                    p.report({
                        message: statusMessages_1.StatusMessages.WIN_SUCCESS_ANALYZE_DEPENDENCIES
                    });
                    return respId;
                }))
                    .then((respId) => __awaiter(this, void 0, void 0, function* () {
                    console.log(`Analyzing your stack, id ${respId}`);
                    const options = {};
                    options['uri'] = `${apiendpoint_1.Apiendpoint.STACK_API_URL}stack-analyses/${respId}?user_key=${apiendpoint_1.Apiendpoint.STACK_API_USER_KEY}`;
                    let timeoutCounter = constants_1.getRequestTimeout / constants_1.getRequestPollInterval;
                    const interval = setInterval(() => {
                        stackAnalysisService_1.stackAnalysisServices
                            .getStackAnalysisService(options)
                            .then(data => {
                            if (!data.hasOwnProperty('error')) {
                                clearInterval(interval);
                                p.report({
                                    message: statusMessages_1.StatusMessages.WIN_FAILURE_ANALYZE_DEPENDENCIES
                                });
                                if (dependencyReportPanel_1.DependencyReportPanel.currentPanel) {
                                    dependencyReportPanel_1.DependencyReportPanel.currentPanel.doUpdatePanel(data);
                                }
                                resolve();
                            }
                            else {
                                console.log(`Polling for stack report, remaining count:${timeoutCounter}`);
                                --timeoutCounter;
                                if (timeoutCounter <= 0) {
                                    let errMsg = `Failed to trigger application's stack analysis, try in a while.`;
                                    clearInterval(interval);
                                    p.report({
                                        message: statusMessages_1.StatusMessages.WIN_FAILURE_ANALYZE_DEPENDENCIES
                                    });
                                    stackanalysismodule.handleError(errMsg);
                                    reject();
                                }
                            }
                        })
                            .catch(error => {
                            clearInterval(interval);
                            p.report({
                                message: statusMessages_1.StatusMessages.WIN_FAILURE_ANALYZE_DEPENDENCIES
                            });
                            stackanalysismodule.handleError(error);
                            reject(error);
                        });
                    }, constants_1.getRequestPollInterval);
                }))
                    .catch(err => {
                    p.report({
                        message: statusMessages_1.StatusMessages.WIN_FAILURE_RESOLVE_DEPENDENCIES
                    });
                    stackanalysismodule.handleError(err);
                    reject();
                });
            });
        });
    };
    stackanalysismodule.processStackAnalyses = (context, workspaceFolder, ecosystem, uri = null) => {
        let effectiveF8Var, argumentList;
        apiendpoint_1.Apiendpoint.API_ECOSYSTEM = ecosystem;
        if (ecosystem === 'maven') {
            argumentList = uri
                ? uri.fsPath
                : paths.join(workspaceFolder.uri.fsPath, 'pom.xml');
            effectiveF8Var = 'effectivef8Pom';
        }
        else if (ecosystem === 'npm') {
            argumentList = uri
                ? uri.fsPath.split('package.json')[0]
                : workspaceFolder.uri.fsPath;
            effectiveF8Var = 'effectivef8Package';
        }
        else if (ecosystem === 'pypi') {
            argumentList = uri
                ? uri.fsPath.split('requirements.txt')[0]
                : workspaceFolder.uri.fsPath;
            effectiveF8Var = 'effectivef8Pypi';
        }
        stackanalysismodule.stackAnalysesLifeCycle(context, effectiveF8Var, argumentList);
    };
    stackanalysismodule.handleError = err => {
        if (dependencyReportPanel_1.DependencyReportPanel.currentPanel) {
            dependencyReportPanel_1.DependencyReportPanel.currentPanel.doUpdatePanel('error');
        }
        vscode.window.showErrorMessage(err);
    };
})(stackanalysismodule = exports.stackanalysismodule || (exports.stackanalysismodule = {}));
//# sourceMappingURL=stackanalysismodule.js.map