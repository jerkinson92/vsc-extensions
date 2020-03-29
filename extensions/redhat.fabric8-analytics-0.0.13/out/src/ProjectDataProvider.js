"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const paths = require("path");
const os = require("os");
const child_process_1 = require("child_process");
const Utils_1 = require("./Utils");
const statusMessages_1 = require("./statusMessages");
const extension_1 = require("./extension");
const commands_1 = require("./commands");
var ProjectDataProvider;
(function (ProjectDataProvider) {
    ProjectDataProvider.isOutputChannelActivated = () => {
        if (!extension_1.outputChannelDep) {
            return extension_1.initOutputChannel();
        }
        else {
            return extension_1.outputChannelDep;
        }
    };
    ProjectDataProvider.effectivef8Pom = item => {
        return new Promise((resolve, reject) => {
            const outputChannelDep = ProjectDataProvider.isOutputChannelActivated();
            outputChannelDep.clearOutputChannel();
            let tempTarget = item.replace('pom.xml', '');
            const filepath = paths.join(tempTarget, 'target', 'dependencies.txt');
            const cmd = [
                Utils_1.Utils.getMavenExecutable(),
                `--quiet`,
                `clean -f`,
                `"${item}" &&`,
                Utils_1.Utils.getMavenExecutable(),
                `--quiet`,
                'org.apache.maven.plugins:maven-dependency-plugin:3.0.2:tree',
                '-f',
                `"${item}"`,
                `-DoutputFile="${filepath}"`,
                `-DoutputType=dot`,
                `-DappendOutput=true`
            ].join(' ');
            console.log('CMD : ' + cmd);
            outputChannelDep.addMsgOutputChannel('\n CMD :' + cmd);
            child_process_1.exec(cmd, { maxBuffer: 1024 * 1200 }, (error, _stdout, _stderr) => {
                let outputMsg = `\n STDOUT : ${_stdout} \n STDERR : ${_stderr}`;
                outputChannelDep.addMsgOutputChannel(outputMsg);
                if (error) {
                    vscode.window
                        .showErrorMessage(`${error.message}.`, 'Show Output Log ...')
                        .then((selection) => {
                        if (selection === 'Show Output Log ...') {
                            vscode.commands.executeCommand(commands_1.Commands.TRIGGER_STACK_LOGS);
                        }
                    });
                    console.log('_stdout :' + _stdout);
                    console.log('_stderr :' + _stderr);
                    console.log('error :' + error);
                    reject(false);
                }
                else {
                    resolve(filepath);
                }
            });
        });
    };
    ProjectDataProvider.effectivef8Package = item => {
        return new Promise((resolve, reject) => {
            ProjectDataProvider.getDependencyVersion(item)
                .then(() => {
                let formPackagedependencyPromise = ProjectDataProvider.formPackagedependencyNpmList(item);
                formPackagedependencyPromise
                    .then(data => {
                    resolve(data);
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        });
    };
    function isEmptyObject(obj) {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }
        return true;
    }
    function clearEmptyObject(myObj) {
        for (let key in myObj) {
            if (!(myObj[key] instanceof Array) &&
                typeof myObj[key] === 'object' &&
                isEmptyObject(myObj[key])) {
                delete myObj[key];
            }
        }
        return myObj;
    }
    function formatObj(myObj, keyArrays) {
        for (let key in myObj) {
            if (keyArrays.indexOf(key) === -1 &&
                (myObj[key] instanceof Array ||
                    typeof myObj[key] !== 'object' ||
                    isEmptyObject(myObj[key]))) {
                delete myObj[key];
            }
            else {
                if (typeof myObj[key] === 'object') {
                    formatObj(myObj[key], keyArrays);
                }
            }
        }
        return (myObj = clearEmptyObject(myObj));
    }
    ProjectDataProvider.formPackagedependencyNpmList = item => {
        let npmListPath = paths.join(item, 'target', 'npmlist.json');
        return new Promise((resolve, reject) => {
            fs.readFile(npmListPath, { encoding: 'utf-8' }, function (err, data) {
                if (data) {
                    let packageListDependencies = JSON.parse(data);
                    let packageDependencies = formatObj(packageListDependencies, [
                        'name',
                        'version'
                    ]);
                    fs.writeFile(npmListPath, JSON.stringify(packageDependencies), function (err) {
                        if (err) {
                            vscode.window.showErrorMessage(`Unable to format ${npmListPath}`);
                            reject(err);
                        }
                        else {
                            resolve(npmListPath);
                        }
                    });
                }
                else {
                    vscode.window.showErrorMessage(`Unable to parse ${npmListPath}`);
                    reject(`Unable to parse ${npmListPath}`);
                }
            });
        });
    };
    ProjectDataProvider.getDependencyVersion = item => {
        const outputChannelDep = ProjectDataProvider.isOutputChannelActivated();
        outputChannelDep.clearOutputChannel();
        return new Promise((resolve, reject) => {
            let dir = paths.join(item, 'target');
            let npmPrefixPath = paths.join(item);
            let npmListPath = paths.join(item, 'target', 'npmlist.json');
            let prefixPath = ProjectDataProvider.trimTrailingChars(item);
            let cmdList;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            else if (fs.existsSync(`${npmListPath}`)) {
                fs.unlink(npmListPath, err => {
                    if (err) {
                        console.log(`unable to delete npmlist. ${err}`);
                    }
                });
            }
            if (os.platform() === 'win32') {
                cmdList = [
                    Utils_1.Utils.getNodeExecutable(),
                    'install',
                    `"${prefixPath}"`,
                    `--quiet`,
                    '&&',
                    Utils_1.Utils.getNodeExecutable(),
                    'list',
                    `--prefix="${prefixPath}"`,
                    '--prod',
                    `-json >`,
                    `"${npmListPath}"`,
                    `--quiet`
                ];
            }
            else {
                cmdList = [
                    Utils_1.Utils.getNodeExecutable(),
                    `--prefix="${npmPrefixPath}"`,
                    'install',
                    `"${prefixPath}"`,
                    `--quiet`,
                    '&&',
                    Utils_1.Utils.getNodeExecutable(),
                    'list',
                    `--prefix="${prefixPath}"`,
                    '--prod',
                    `-json >`,
                    `"${npmListPath}"`,
                    `--quiet`
                ];
            }
            const CMD = cmdList.join(' ');
            console.log('CMD : ' + CMD);
            outputChannelDep.addMsgOutputChannel('\n CMD :' + CMD);
            child_process_1.exec(CMD, { maxBuffer: 1024 * 1200 }, (error, _stdout, _stderr) => {
                let outputMsg = `\n STDOUT : ${_stdout} \n STDERR : ${_stderr}`;
                outputChannelDep.addMsgOutputChannel(outputMsg);
                if (fs.existsSync(`${npmListPath}`)) {
                    resolve(true);
                }
                else {
                    if (error) {
                        vscode.window
                            .showErrorMessage(`${error.message}.`, 'Show Output Log ...')
                            .then((selection) => {
                            if (selection === 'Show Output Log ...') {
                                vscode.commands.executeCommand(commands_1.Commands.TRIGGER_STACK_LOGS);
                            }
                        });
                    }
                    console.log('_stdout :' + _stdout);
                    console.log('_stderr :' + _stderr);
                    console.log('error :' + error);
                    let errMsg = error
                        ? error.message
                        : 'Unable to resolve dependencies';
                    reject(errMsg);
                }
            });
        });
    };
    ProjectDataProvider.trimTrailingChars = s => {
        let result = s.replace(/\\+$/, '');
        return result;
    };
    ProjectDataProvider.effectivef8Pypi = item => {
        return new Promise((resolve, reject) => {
            const outputChannelDep = ProjectDataProvider.isOutputChannelActivated();
            outputChannelDep.clearOutputChannel();
            let vscodeRootpath = item.replace('requirements.txt', '');
            const filepath = paths.join(vscodeRootpath, 'target', 'pylist.json');
            let reqTxtFilePath = paths.join(vscodeRootpath, 'requirements.txt');
            let dir = paths.join(vscodeRootpath, 'target');
            let pyPiInterpreter = Utils_1.Utils.getPypiExecutable();
            if (pyPiInterpreter &&
                pyPiInterpreter.indexOf('${workspaceFolder}') !== -1) {
                pyPiInterpreter = pyPiInterpreter.replace('${workspaceFolder}', vscodeRootpath);
            }
            if (!pyPiInterpreter) {
                vscode.window
                    .showInformationMessage(statusMessages_1.StatusMessages.PYPI_INTERPRETOR_PATH, 'More Details')
                    .then(selection => {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://github.com/fabric8-analytics/fabric8-analytics-vscode-extension#prerequisites'));
                });
                reject(false);
                return;
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const cmd = [
                pyPiInterpreter,
                `-m pip install`,
                `--user`,
                `-r`,
                reqTxtFilePath,
                `&&`,
                pyPiInterpreter,
                '-',
                reqTxtFilePath,
                filepath
            ].join(' ');
            console.log('CMD : ' + cmd);
            outputChannelDep.addMsgOutputChannel('\n CMD :' + cmd);
            const depGenerator = child_process_1.exec(cmd, { maxBuffer: 1024 * 1200 }, (error, _stdout, _stderr) => {
                let outputMsg = `\n STDOUT : ${_stdout} \n STDERR : ${_stderr}`;
                outputChannelDep.addMsgOutputChannel(outputMsg);
                if (error) {
                    vscode.window.showErrorMessage(_stderr);
                    console.log(_stderr);
                    console.log(error.message);
                    reject(_stderr);
                }
                else {
                    resolve(filepath);
                }
            });
            console.log('SCRIPT -: ' + statusMessages_1.StatusMessages.PYPI_INTERPRETOR_CMD);
            // write the dependency generator script into stdin
            depGenerator.stdin.end(statusMessages_1.StatusMessages.PYPI_INTERPRETOR_CMD);
        });
    };
})(ProjectDataProvider = exports.ProjectDataProvider || (exports.ProjectDataProvider = {}));
//# sourceMappingURL=ProjectDataProvider.js.map