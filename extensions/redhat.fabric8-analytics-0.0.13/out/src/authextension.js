'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const apiendpoint_1 = require("./apiendpoint");
const stackAnalysisService_1 = require("./stackAnalysisService");
var authextension;
(function (authextension) {
    authextension.setContextData = (context_f8_access_routes, context_f8_3scale_user_key) => {
        apiendpoint_1.Apiendpoint.STACK_API_URL = context_f8_access_routes.prod + '/api/v1/';
        apiendpoint_1.Apiendpoint.STACK_API_USER_KEY = context_f8_3scale_user_key;
        apiendpoint_1.Apiendpoint.OSIO_ROUTE_URL = context_f8_access_routes.prod;
        process.env['RECOMMENDER_API_URL'] =
            context_f8_access_routes.prod + '/api/v1';
        process.env['THREE_SCALE_USER_TOKEN'] = context_f8_3scale_user_key;
    };
    authextension.authorize_f8_analytics = context => {
        return new Promise((resolve, reject) => {
            let context_f8_access_routes = context.globalState.get('f8_access_routes');
            let context_f8_3scale_user_key = context.globalState.get('f8_3scale_user_key');
            if (context_f8_access_routes && context_f8_3scale_user_key) {
                authextension.setContextData(context_f8_access_routes, context_f8_3scale_user_key);
                resolve(true);
            }
            else {
                authextension.get_3scale_routes(context)
                    .then(resp => {
                    resolve(resp);
                })
                    .catch(err => {
                    reject(err);
                });
            }
        });
    };
    authextension.get_3scale_routes = context => {
        return new Promise((resolve, reject) => {
            let options = {};
            options['uri'] = `${apiendpoint_1.Apiendpoint.THREE_SCALE_CONNECT_URL}get-endpoints?user_key=${apiendpoint_1.Apiendpoint.THREE_SCALE_CONNECT_KEY}`;
            options['headers'] = { 'Content-Type': 'application/json' };
            stackAnalysisService_1.stackAnalysisServices
                .get3ScaleRouteService(options)
                .then(respData => {
                let resp = respData;
                if (resp && resp['endpoints']) {
                    context.globalState.update('f8_access_routes', resp['endpoints']);
                    context.globalState.update('f8_3scale_user_key', resp['user_key']);
                    let context_f8_access_routes = context.globalState.get('f8_access_routes');
                    let context_f8_3scale_user_key = context.globalState.get('f8_3scale_user_key');
                    authextension.setContextData(context_f8_access_routes, context_f8_3scale_user_key);
                    resolve(true);
                }
            })
                .catch(err => {
                reject(null);
            });
        });
    };
})(authextension = exports.authextension || (exports.authextension = {}));
//# sourceMappingURL=authextension.js.map