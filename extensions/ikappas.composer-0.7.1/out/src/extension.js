/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const composer_extension_1 = require("./composer-extension");
function activate(context) {
    let composer = new composer_extension_1.ComposerExtension();
    context.subscriptions.push(composer);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map