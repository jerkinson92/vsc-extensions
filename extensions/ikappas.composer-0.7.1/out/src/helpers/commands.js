/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class CommandNames {
}
CommandNames.CommandPrefix = constants_1.Constants.ExtensionName + '.';
CommandNames.About = CommandNames.CommandPrefix + 'About';
CommandNames.Archive = CommandNames.CommandPrefix + 'Archive';
CommandNames.ClearCache = CommandNames.CommandPrefix + 'ClearCache';
CommandNames.Diagnose = CommandNames.CommandPrefix + 'Diagnose';
CommandNames.DumpAutoload = CommandNames.CommandPrefix + 'DumpAutoload';
CommandNames.Install = CommandNames.CommandPrefix + 'Install';
CommandNames.Remove = CommandNames.CommandPrefix + 'Remove';
CommandNames.RemovePackage = CommandNames.CommandPrefix + 'RemovePackage';
CommandNames.Require = CommandNames.CommandPrefix + 'Require';
CommandNames.RunScript = CommandNames.CommandPrefix + 'RunScript';
CommandNames.SelfUpdate = CommandNames.CommandPrefix + 'SelfUpdate';
CommandNames.Show = CommandNames.CommandPrefix + 'Show';
CommandNames.Status = CommandNames.CommandPrefix + 'Status';
CommandNames.Update = CommandNames.CommandPrefix + 'Update';
CommandNames.Validate = CommandNames.CommandPrefix + 'Validate';
CommandNames.Version = CommandNames.CommandPrefix + 'Version';
exports.CommandNames = CommandNames;
//# sourceMappingURL=commands.js.map