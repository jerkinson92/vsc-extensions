'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Commonly used messages
 */
var StatusMessages;
(function (StatusMessages) {
    StatusMessages.EXT_TITLE = `Dependency Analytics`;
    StatusMessages.WIN_RESOLVING_DEPENDENCIES = `Resolving application dependencies...`;
    StatusMessages.WIN_ANALYZING_DEPENDENCIES = `Analyzing application dependencies...`;
    StatusMessages.WIN_SUCCESS_ANALYZE_DEPENDENCIES = `Generating dependency analytics report...`;
    StatusMessages.WIN_FAILURE_ANALYZE_DEPENDENCIES = `Unable to generate stack report`;
    StatusMessages.WIN_FAILURE_RESOLVE_DEPENDENCIES = `Unable to generate stack report`;
    StatusMessages.WIN_SHOW_LOGS = `No output channel has been created for Dependency Analytics`;
    StatusMessages.LSP_INITIALIZE = `Initializing Language Server`;
    StatusMessages.REPORT_TAB_TITLE = `Dependency Analytics Report`;
    StatusMessages.NO_SUPPORTED_MANIFEST = `No supported manifest's file found to be analyzed.`;
    StatusMessages.PYPI_INTERPRETOR_PATH = 'Provide path for python interpretor `Code/File -> Preferences -> Settings -> Workspace Settings`.For details check READMEs';
    StatusMessages.PYPI_INTERPRETOR_CMD = `
import pkg_resources as pr;import json,sys;gd=pr.get_distribution;res=list();
for i in open(sys.argv[1]):
    try:
        rs={};I=gd(i);rs["package"]=I.key;rs["version"]=I.version;rs["deps"]=set();
        for j in pr.require(i):
            for k in j.requires():
                K=gd(k);rs["deps"].add((K.key, K.version))
        rs["deps"]=[{"package":p,"version":v}for p,v in rs["deps"]];res.append(rs)
    except: pass
a=sys.argv[2:3]
op=open(a[0],"w")if a else sys.stdout
json.dump(res,op)`;
    StatusMessages.PYPI_FAILURE = `Looks like there are some problem with manifest file or python interpreter is not set`;
})(StatusMessages = exports.StatusMessages || (exports.StatusMessages = {}));
//# sourceMappingURL=statusMessages.js.map