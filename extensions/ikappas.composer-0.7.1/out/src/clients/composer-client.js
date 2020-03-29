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
const errors_1 = require("../helpers/errors");
const execution_1 = require("../helpers/execution");
const child_process_1 = require("child_process");
const strings_1 = require("../helpers/strings");
const iconv = require("iconv-lite");
const events_1 = require("events");
const lifecycle_1 = require("../helpers/lifecycle");
class ComposerClient {
    constructor(executablePath, workingPath, env, encoding) {
        this._onOutput = new events_1.EventEmitter();
        this._executablePath = executablePath;
        this._workingPath = workingPath;
        encoding = encoding || 'utf8';
        this._encoding = iconv.encodingExists(encoding) ? encoding : 'utf8';
        this.env = env || {};
    }
    /**
     * Get the composer executable path.
     */
    get executablePath() {
        return this._executablePath;
    }
    /**
     * Get the composer working path.
     */
    get workingPath() {
        return this._workingPath;
    }
    /**
     * Get the encoding to use.
     */
    get encoding() {
        return this._encoding;
    }
    /**
     * Get the stream output handler.
     */
    get streamOutputHandler() {
        return (output) => {
            this.log(output);
        };
    }
    /**
     * Short information about Composer.
     */
    about() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['about']);
        });
    }
    /**
     * Create an archive of this composer package.
     */
    archive(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['archive'].concat(args));
        });
    }
    /**
     * Opens the package's repository URL or homepage in your browser.
     */
    browse() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement "browse".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'browse')
            });
        });
    }
    /**
     * Clears composer's internal package cache.
     */
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['clear-cache']);
        });
    }
    /**
     * Set config options.
     */
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement "config".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'config')
            });
        });
    }
    /**
     * Create new project from a package into given directory.
     */
    createProject() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement "create-project".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'create-project')
            });
        });
    }
    /**
     * Shows which packages cause the given package to be installed.
     */
    depends(_pkg, _recursive = false, _tree = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement "depends".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'depends')
            });
        });
    }
    /**
     * Diagnoses the system to identify common errors.
     */
    diagnose() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['diagnose']);
        });
    }
    /**
     * Dumps the autoloader.
     */
    dumpAutoload(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['dump-autoload'].concat(args));
        });
    }
    /**
     * Displays help for a command.
     */
    help(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['help', command]);
        });
    }
    /**
     * Opens the package's repository URL or homepage in your browser.
     */
    home() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: implement "home".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'home')
            });
        });
    }
    /**
     * Creates a basic composer.json file in current directory.
     */
    init(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['init'].concat(args));
        });
    }
    /**
     * Installs the project dependencies from the composer.lock file if present, or falls back on the composer.json.
     */
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['install']);
        });
    }
    /**
     * Show information about licenses of dependencies.
     */
    licenses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['licenses']);
        });
    }
    /**
     * Shows which packages prevent the given package from being installed
     */
    prohibits(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['prohibits'].concat(args));
        });
    }
    /**
     * Adds required packages to your composer.json and installs them.
     */
    require(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['require'].concat(args));
        });
    }
    /**
     * Removes a package from the require or require-dev.
     */
    remove(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['remove'].concat(args));
        });
    }
    /**
     * Run the scripts defined in composer.json.
     */
    runScript(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['run-script'].concat(args));
        });
    }
    /**
     * Search for packages.
     */
    search() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement "search".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'search')
            });
        });
    }
    /**
     * Updates composer.phar to the latest version.
     */
    selfUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['self-update']);
        });
    }
    /**
     * Show information about packages.
     */
    show(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['show'].concat(args));
        });
    }
    /**
     * Show a list of locally modified packages.
     */
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['status']);
        });
    }
    /**
     * Show package suggestions.
     */
    suggests() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['suggests']);
        });
    }
    /**
     * Updates your dependencies to the latest version according to composer.json, and updates the composer.lock file.
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['update']);
        });
    }
    /**
     * Validates a composer.json and composer.lock
     */
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stream(['validate']);
        });
    }
    /**
     * Shows the composer version.
     */
    version() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.run(['--version']);
        });
    }
    /**
     * Shows which packages cause the given package to be installed.
     */
    why(_pkg) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement "why".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'why')
            });
        });
    }
    /**
     * Shows which packages prevent the given package from being installed.
     */
    whyNot(_pkg) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement "why-not".
            throw new errors_1.ComposerError({
                message: String.format(strings_1.Strings.ComposerCommandNotImplemented, 'why-not')
            });
        });
    }
    run(args, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ cwd: this.workingPath, encoding: this.encoding }, options || {});
            return this.exec(args, options);
        });
    }
    stream(args, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ cwd: this.workingPath, encoding: this.encoding }, options || {});
            const child = this.spawn(args, options);
            return execution_1.stream(child, this.streamOutputHandler, this.encoding).then(r => { this.log('\n'); return r; });
        });
    }
    exec(args, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const child = this.spawn(args, options);
            if (options.input) {
                child.stdin.end(options.input, 'utf8');
            }
            return execution_1.exec(child).then(result => {
                if (options.log !== false) {
                    if (result.exitCode) {
                        this.log(`${result.stderr}\n`);
                    }
                    else if (result.stderr) {
                        this.log(`${result.stderr}\n`);
                    }
                    else {
                        this.log(`${result.stdout}\n`);
                    }
                }
                return result;
            });
        });
    }
    spawn(args, options = {}) {
        if (!this.executablePath) {
            throw new Error(strings_1.Strings.ComposerNotFound);
        }
        if (!options) {
            options = {};
        }
        if (!options.stdio && !options.input) {
            options.stdio = ['ignore', null, null]; // Unless provided, ignore stdin and leave default streams for stdout and stderr
        }
        options.env = Object.assign({}, options.env || {});
        options.env = Object.assign(options.env, this.env);
        if (options.log !== false) {
            this.log(String.format(strings_1.Strings.WorkingDirectory + '\n', options.cwd));
            this.log(String.format(strings_1.Strings.ExecutingCommand + '\n\n', args.join(' ')));
        }
        // Disable progress on specific commands
        if (args[0] && ['install', 'update'].indexOf(args[0]) > -1) {
            args.unshift('--no-progress');
        }
        // Disable ansi output
        args.unshift('--no-ansi');
        return child_process_1.spawn(this.executablePath, args, options);
    }
    /**
     * An event that is emitted when a composer settings object is set.
     */
    onOutput(listener) {
        this._onOutput.addListener('log', listener);
        return lifecycle_1.toDisposable(() => this._onOutput.removeListener('log', listener));
    }
    /**
     * Log output.
     * @param output The output to log.
     */
    log(output) {
        this._onOutput.emit('log', output);
    }
}
exports.ComposerClient = ComposerClient;
//# sourceMappingURL=composer-client.js.map