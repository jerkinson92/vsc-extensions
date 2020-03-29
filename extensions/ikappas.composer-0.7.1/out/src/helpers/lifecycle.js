/*---------------------------------------------------------------------------------------------
 * Copyright (C) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function dispose(...disposables) {
    const first = disposables[0];
    if (Array.isArray(first)) {
        disposables = first;
    }
    disposables.forEach(d => d && d.dispose());
    return [];
}
exports.dispose = dispose;
function combinedDisposable(disposables) {
    return { dispose: () => dispose(disposables) };
}
exports.combinedDisposable = combinedDisposable;
function toDisposable(...fns) {
    return combinedDisposable(fns.map(fn => ({ dispose: fn })));
}
exports.toDisposable = toDisposable;
//# sourceMappingURL=lifecycle.js.map