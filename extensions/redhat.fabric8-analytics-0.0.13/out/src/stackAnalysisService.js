'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const request = require("request");
var stackAnalysisServices;
(function (stackAnalysisServices) {
    stackAnalysisServices.clearContextInfo = context => {
        context.globalState.update('f8_3scale_user_key', '');
        context.globalState.update('f8_access_routes', '');
    };
    stackAnalysisServices.getStackAnalysisService = options => {
        let errorMsg;
        return new Promise((resolve, reject) => {
            request.get(options, (err, httpResponse, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (httpResponse.statusCode === 200 ||
                        httpResponse.statusCode === 202) {
                        let resp = JSON.parse(body);
                        resolve(resp);
                    }
                    else if (httpResponse.statusCode === 401) {
                        errorMsg = `Failed :: ${httpResponse.statusMessage}, Status: ${httpResponse.statusCode}`;
                        reject(errorMsg);
                    }
                    else if (httpResponse.statusCode === 429 ||
                        httpResponse.statusCode === 403) {
                        vscode.window.showInformationMessage(`Service is currently busy to process your request for analysis, please try again in few minutes. Status:  ${httpResponse.statusCode} - ${httpResponse.statusMessage} `);
                        reject(httpResponse.statusCode);
                    }
                    else {
                        errorMsg = `Failed to trigger application's stack analysis, try in a while. Status: ${httpResponse.statusCode} - ${httpResponse.statusMessage}`;
                        reject(errorMsg);
                    }
                }
            });
        });
    };
    stackAnalysisServices.postStackAnalysisService = (options, context) => {
        let errorMsg;
        return new Promise((resolve, reject) => {
            console.log('Options', options && options.formData);
            console.log('Options', options && options.headers);
            request.post(options, (err, httpResponse, body) => {
                if (err) {
                    stackAnalysisServices.clearContextInfo(context);
                    console.log('error', err);
                    reject(err);
                }
                else {
                    console.log('response Post ' + body);
                    if (httpResponse.statusCode === 200 ||
                        httpResponse.statusCode === 202) {
                        let resp = JSON.parse(body);
                        if (resp.error === undefined && resp.status === 'success') {
                            resolve(resp.id);
                        }
                        else {
                            errorMsg = `Failed :: ${resp.error}, Status: ${httpResponse.statusCode}`;
                            reject(errorMsg);
                        }
                    }
                    else if (httpResponse.statusCode === 401) {
                        stackAnalysisServices.clearContextInfo(context);
                        errorMsg = `Failed :: ${httpResponse.statusMessage}, Status: ${httpResponse.statusCode}`;
                        reject(errorMsg);
                    }
                    else if (httpResponse.statusCode === 429 ||
                        httpResponse.statusCode === 403) {
                        errorMsg = `Service is currently busy to process your request for analysis, please try again in few minutes, Status: ${httpResponse.statusCode} - ${httpResponse.statusMessage}`;
                        reject(errorMsg);
                    }
                    else if (httpResponse.statusCode === 400) {
                        errorMsg = `Manifest file(s) are not proper. Status:  ${httpResponse.statusCode} - ${httpResponse.statusMessage} `;
                        reject(errorMsg);
                    }
                    else if (httpResponse.statusCode === 408) {
                        errorMsg = `Stack analysis request has timed out. Status:  ${httpResponse.statusCode} - ${httpResponse.statusMessage} `;
                        reject(errorMsg);
                    }
                    else {
                        stackAnalysisServices.clearContextInfo(context);
                        errorMsg = `Failed to trigger application's stack analysis, try in a while. Status: ${httpResponse.statusCode} - ${httpResponse.statusMessage}`;
                        reject(errorMsg);
                    }
                }
            });
        });
    };
    stackAnalysisServices.get3ScaleRouteService = (options) => {
        return new Promise((resolve, reject) => {
            request.get(options, (err, httpResponse, body) => {
                if (err) {
                    reject(null);
                }
                else {
                    if (httpResponse.statusCode === 200 ||
                        httpResponse.statusCode === 202) {
                        let resp = JSON.parse(body);
                        resolve(resp);
                    }
                    else {
                        vscode.window.showErrorMessage(`Looks like there is some intermittent issue while communicating with services, please try again. Status: ${httpResponse.statusCode}`);
                        reject(null);
                    }
                }
            });
        });
    };
})(stackAnalysisServices = exports.stackAnalysisServices || (exports.stackAnalysisServices = {}));
//# sourceMappingURL=stackAnalysisService.js.map