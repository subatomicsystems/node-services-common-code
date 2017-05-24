'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}
exports.default = default_1;
;
//# sourceMappingURL=cors.js.map