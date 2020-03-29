/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerErrorCodes = {
    BadConfigFile: 'BadConfigFile',
    NotAComposerRepository: 'NotAComposerRepository',
};
function getComposerErrorCode(stderr) {
    if (/Not a composer repository/.test(stderr)) {
        return exports.ComposerErrorCodes.NotAComposerRepository;
    }
    else if (/bad config file/.test(stderr)) {
        return exports.ComposerErrorCodes.BadConfigFile;
    }
    return void 0;
}
exports.getComposerErrorCode = getComposerErrorCode;
class ComposerError {
    constructor(data) {
        if (data.error) {
            this.error = data.error;
            this.message = data.error.message;
        }
        else {
            this.error = void 0;
        }
        this.message = this.message || data.message || 'composer error';
        this.stdout = data.stdout;
        this.stderr = data.stderr;
        this.exitCode = data.exitCode;
        this.composerErrorCode = data.composerErrorCode;
        this.composerCommand = data.composerCommand;
    }
    toString() {
        let result = this.message + ' ' + JSON.stringify({
            exitCode: this.exitCode,
            composerErrorCode: this.composerErrorCode,
            composerCommand: this.composerCommand,
            stdout: this.stdout,
            stderr: this.stderr
        }, null, 2);
        if (this.error) {
            result += this.error.stack;
        }
        return result;
    }
}
exports.ComposerError = ComposerError;
//# sourceMappingURL=errors.js.map