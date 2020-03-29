"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const template_1 = require("./template");
const apiendpoint_1 = require("./apiendpoint");
const loader = template_1.Templates.LOADER_TEMPLATE;
const header = template_1.Templates.HEADER_TEMPLATE;
const footer = template_1.Templates.FOOTER_TEMPLATE;
let portal_uri = '';
/**
 * Manages cat coding webview panels
 */
class DependencyReportPanel {
    constructor(panel) {
        this._disposables = [];
        this._panel = panel;
        // Set the webview's initial html content
        // this._update();
        this._updateWebView();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                // this._update();
                this._updateWebView();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionPath, data) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        DependencyReportPanel.data = data;
        // If we already have a panel, show it.
        if (DependencyReportPanel.currentPanel) {
            DependencyReportPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(DependencyReportPanel.viewType, 'Dependency Analytics Report', column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            retainContextWhenHidden: true,
            // And restric the webview to only loading content from our extension's `media` directory.
            localResourceRoots: []
        });
        DependencyReportPanel.currentPanel = new DependencyReportPanel(panel);
    }
    doUpdatePanel(data) {
        if (data && data.request_id) {
            DependencyReportPanel.data = data;
            let r = header;
            let token_uri = undefined;
            portal_uri = `${apiendpoint_1.Apiendpoint.STACK_REPORT_URL}#/analyze/${data.request_id}?interframe=true&api_data={"access_token":"${token_uri}","route_config":{"api_url":"${apiendpoint_1.Apiendpoint.OSIO_ROUTE_URL}"},"user_key":"${apiendpoint_1.Apiendpoint.STACK_API_USER_KEY}"}`;
            r += render_stack_iframe(portal_uri);
            r += footer;
            this._panel.webview.html = r;
        }
        else if (data && data === 'error') {
            let r = header;
            r += render_project_failure();
            r += footer;
            this._panel.webview.html = r;
        }
    }
    dispose() {
        DependencyReportPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        DependencyReportPanel.data = null;
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _updateWebView() {
        this._panel.title = 'Dependency Analytics Report';
        this._panel.webview.html = this._renderHtmlForWebView();
    }
    _renderHtmlForWebView() {
        let output = DependencyReportPanel.data;
        if (output && output.request_id) {
            let r = header;
            let token_uri = undefined;
            portal_uri = `${apiendpoint_1.Apiendpoint.STACK_REPORT_URL}#/analyze/${output.request_id}?interframe=true&api_data={"access_token":"${token_uri}","route_config":{"api_url":"${apiendpoint_1.Apiendpoint.OSIO_ROUTE_URL}"},"user_key":"${apiendpoint_1.Apiendpoint.STACK_API_USER_KEY}"}`;
            r += render_stack_iframe(portal_uri);
            r += footer;
            return r;
        }
        else {
            return loader;
        }
    }
}
exports.DependencyReportPanel = DependencyReportPanel;
DependencyReportPanel.viewType = 'stackReport';
let render_project_failure = () => {
    return `<div>
                <p style='color:#000000;text-align: center;'>Unable to analyze your stack.</p>
              </div>`;
};
let render_stack_iframe = portaluri => {
    //const result = sa.result[0];
    return `<iframe width="100%" height="100%" frameborder="0" src=${portaluri} id="frame2" name="frame2"></iframe>`;
};
//# sourceMappingURL=dependencyReportPanel.js.map