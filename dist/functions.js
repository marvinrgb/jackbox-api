"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCharacter = exports.randomCode = void 0;
function randomCode() {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
exports.randomCode = randomCode;
const openpeeps_1 = require("./openpeeps");
function randomCharacter() {
    return {
        name: "Marv",
        body: Math.floor(Math.random() * openpeeps_1.data.body.length),
        face: Math.floor(Math.random() * openpeeps_1.data.face.length),
        head: Math.floor(Math.random() * openpeeps_1.data.head.length),
        accessories: Math.floor(Math.random() * openpeeps_1.data.accessories.length),
    };
}
exports.randomCharacter = randomCharacter;
//# sourceMappingURL=functions.js.map