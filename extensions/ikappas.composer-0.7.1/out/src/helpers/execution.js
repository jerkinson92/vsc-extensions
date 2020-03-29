/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lifecycle_1 = require("./lifecycle");
const iconv = require("iconv-lite");
const errors_1 = require("./errors");
function cpErrorHandler(cb) {
    return err => {
        if (/ENOENT/.test(err.message)) {
            err = new errors_1.ComposerError({
                error: err,
                message: 'Failed to execute composer (ENOENT)',
                composerErrorCode: errors_1.ComposerErrorCodes.NotAComposerRepository
            });
        }
        cb(err);
    };
}
function exec(child, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!child.stdout || !child.stderr) {
            throw new Error('Failed to get stdout or stderr from composer process.');
        }
        const disposables = [];
        const once = (ee, name, fn) => {
            ee.once(name, fn);
            disposables.push(lifecycle_1.toDisposable(() => ee.removeListener(name, fn)));
        };
        const on = (ee, name, fn) => {
            ee.on(name, fn);
            disposables.push(lifecycle_1.toDisposable(() => ee.removeListener(name, fn)));
        };
        let encoding = options.encoding || 'utf8';
        encoding = iconv.encodingExists(encoding) ? encoding : 'utf8';
        const [exitCode, stdout, stderr] = yield Promise.all([
            new Promise((resolve, reject) => {
                once(child, 'error', cpErrorHandler(reject));
                once(child, 'exit', resolve);
            }),
            new Promise(resolve => {
                const buffers = [];
                on(child.stdout, 'data', (b) => buffers.push(b));
                once(child.stdout, 'close', () => resolve(iconv.decode(Buffer.concat(buffers), encoding)));
            }),
            new Promise(resolve => {
                const buffers = [];
                on(child.stderr, 'data', (b) => buffers.push(b));
                once(child.stderr, 'close', () => resolve(Buffer.concat(buffers).toString('utf8')));
            })
        ]);
        lifecycle_1.dispose(disposables);
        return { exitCode, stdout, stderr };
    });
}
exports.exec = exec;
function stream(child, progress, encoding = 'utf8') {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        const once = (ee, name, fn) => {
            ee.once(name, fn);
            disposables.push(lifecycle_1.toDisposable(() => ee.removeListener(name, fn)));
        };
        const on = (ee, name, fn) => {
            ee.on(name, fn);
            disposables.push(lifecycle_1.toDisposable(() => ee.removeListener(name, fn)));
        };
        let exitCode = new Promise((resolve, reject) => {
            once(child, 'error', reject);
            once(child, 'exit', resolve);
        });
        let stdout = new Promise(resolve => {
            let buffers = [];
            on(child.stdout, 'data', (b) => {
                buffers.push(b);
                progress(iconv.decode(b, encoding));
            });
            once(child.stdout, 'close', () => resolve(iconv.decode(Buffer.concat(buffers), encoding)));
        });
        let stderr = new Promise(resolve => {
            let buffers = [];
            on(child.stderr, 'data', (b) => {
                buffers.push(b);
                progress(iconv.decode(b, encoding));
            });
            once(child.stderr, 'close', () => resolve(iconv.decode(Buffer.concat(buffers), encoding)));
        });
        return Promise.all([exitCode, stdout, stderr]).then((values) => {
            lifecycle_1.dispose(disposables);
            return {
                exitCode: values[0],
                stdout: values[1],
                stderr: values[2]
            };
        });
    });
}
exports.stream = stream;
//# sourceMappingURL=execution.js.map