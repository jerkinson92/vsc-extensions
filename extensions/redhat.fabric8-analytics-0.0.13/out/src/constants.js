'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Commonly used constants
 */
var GlobalState;
(function (GlobalState) {
    // to store the current version string to localStorage
    GlobalState["Version"] = "fabric8Version";
})(GlobalState = exports.GlobalState || (exports.GlobalState = {}));
// Refer `name` from package.json
exports.extensionId = 'fabric8-analytics';
// publisher.name from package.json
exports.extensionQualifiedId = `redhat.${exports.extensionId}`;
// GET request timeout
exports.getRequestTimeout = 120 * 1000; // ms
// GET request polling frequency
exports.getRequestPollInterval = 2 * 1000; // ms
//# sourceMappingURL=constants.js.map