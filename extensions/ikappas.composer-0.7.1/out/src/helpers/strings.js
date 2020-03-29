/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:variable-name */
class Strings {
}
Strings.WorkingDirectory = 'Working Directory: {0}';
Strings.ExecutingCommand = 'Executing: composer {0}';
Strings.InputPackageName = 'Input package name';
Strings.InputPackageNamePlaceHolder = 'namespace/name [version]';
Strings.ComposerArchiveInput = 'Optional. Input options, package name and/or version to archive.';
Strings.ComposerArchivePlaceHolder = '[options] [--] [<package>] [<version>]';
Strings.ComposerDumpAutoloadInput = 'Optional. Input options to use.';
Strings.ComposerDumpAutoloadPlaceHolder = '[options]';
Strings.ComposerShowInput = 'Composer Show Arguments';
Strings.ComposerShowPlaceHolder = '[options] [--] [<package>] [<version>]';
Strings.ComposerRequireInput = 'Input options and the name(s) of the package(s) to add';
Strings.ComposerRequirePlaceHolder = '[options] [--] [<packages>] ...';
Strings.ComposerRemoveInput = 'Input options and the name(s) of the package(s) to remove';
Strings.ComposerRemovePlaceHolder = '[options] [--] [<packages>] ...';
Strings.ComposerRunScriptInput = '';
Strings.ComposerRunScriptPlaceHolder = '[options] [--] [<script>] [<args>] ...';
Strings.CommandCompletedSuccessfully = 'Command completed successfully.';
Strings.CommandCompletedWithErrors = 'Command completed with errors.';
Strings.WorkspaceFolderPick = 'Select workspace folder to run composer command ...';
// Errors
Strings.ComposerExecutablePathRequired = 'Please set composer.executablePath in your user settings in order to to access composer features.';
Strings.ComposerNotFound = 'Composer could not be found in the system.';
Strings.ComposerContextRequired = 'Please open a workspace folder in order to access composer features.';
Strings.ComposerProjectRequired = 'Open a folder with a composer project in order to access composer features.';
Strings.ComposerCommandNotImplemented = 'The composer "{0}" command is not implemented';
exports.Strings = Strings;
const _formatRegexp = /{(\d+)}/g;
String.Empty = '';
String.Space = ' ';
String.format = (value, ...args) => {
    if (args.length === 0) {
        return value;
    }
    return value.replace(_formatRegexp, function (match, group) {
        let idx = parseInt(group, 10);
        return isNaN(idx) || idx < 0 || idx >= args.length ?
            match :
            args[idx];
    });
};
//# sourceMappingURL=strings.js.map