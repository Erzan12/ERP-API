"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGlobalPrefix = setupGlobalPrefix;
function setupGlobalPrefix(app) {
    const allowGlobalPrefix = process.env.ALLOW_GLOBAL_PREFIX !== 'no';
    const globalPrefix = allowGlobalPrefix
        ? (process.env.GLOBAL_PREFIX ?? '')
        : '';
    if (allowGlobalPrefix) {
        app.setGlobalPrefix(globalPrefix);
    }
}
//# sourceMappingURL=global-prefix.helper.js.map