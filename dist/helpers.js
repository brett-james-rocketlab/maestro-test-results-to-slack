"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeTestUnits = void 0;
function safeTestUnits(item) {
    // Check that there is none, even if it doesn't exist
    const itemCount = parseInt(item) || 0;
    return (itemCount === 0 ? true : false);
}
exports.safeTestUnits = safeTestUnits;
