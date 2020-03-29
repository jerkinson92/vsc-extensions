'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class DepOutputChannel {
    constructor(channelName = 'Dependency Analytics') {
        if (!this.outputChannel) {
            this.outputChannel = vscode.window.createOutputChannel(channelName);
        }
    }
    getOutputChannel() {
        this.outputChannel.clear();
        return this.outputChannel;
    }
    showOutputChannel() {
        this.outputChannel.show();
    }
    clearOutputChannel() {
        this.outputChannel.clear();
    }
    addMsgOutputChannel(msg) {
        this.outputChannel.append(msg);
    }
}
exports.DepOutputChannel = DepOutputChannel;
//# sourceMappingURL=DepOutputChannel.js.map