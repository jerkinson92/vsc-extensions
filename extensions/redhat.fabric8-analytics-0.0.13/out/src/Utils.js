'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var Utils;
(function (Utils) {
    function getMavenExecutable() {
        const mavenPath = vscode.workspace
            .getConfiguration('maven.executable')
            .get('path');
        return mavenPath ? `"${mavenPath}"` : 'mvn';
    }
    Utils.getMavenExecutable = getMavenExecutable;
    function getNodeExecutable() {
        const npmPath = vscode.workspace
            .getConfiguration('npm.executable')
            .get('path');
        return npmPath ? `"${npmPath}"` : 'npm';
    }
    Utils.getNodeExecutable = getNodeExecutable;
    function getPypiExecutable() {
        const pypiPath = vscode.workspace
            .getConfiguration('python')
            .get('pythonPath');
        return pypiPath ? `${pypiPath}` : 'python';
    }
    Utils.getPypiExecutable = getPypiExecutable;
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=Utils.js.map