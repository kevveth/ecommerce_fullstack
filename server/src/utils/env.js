"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
// Zod schema for validating environment variables
var envSchema = zod_1.z
    .object({
    PORT: zod_1.z.string().optional().default("3000").refine(function (v) { return Number(v) < 65535; }, 'Invalid port range'),
    DB_DATABASE: zod_1.z.string().optional().default("ecommerce"),
    DB_HOST: zod_1.z.string().optional().default("localhost"),
    DB_PORT: zod_1.z.string().optional().default("5432"),
    DB_USER: zod_1.z.string().optional(),
    DB_PASSWORD: zod_1.z.string().optional(),
    SALT_ROUNDS: zod_1.z.string().optional().default("10"),
    SECRET_KEY: zod_1.z.string().optional(),
})
    .transform(function (data) {
    var _a, _b, _c;
    var port = parseInt(data.PORT);
    var dbPort = parseInt(data.DB_PORT);
    var saltRounds = parseInt(data.SALT_ROUNDS);
    var user = (_a = data.DB_USER) !== null && _a !== void 0 ? _a : undefined;
    var password = (_b = data.DB_PASSWORD) !== null && _b !== void 0 ? _b : undefined;
    var secretKey = (_c = data.SECRET_KEY) !== null && _c !== void 0 ? _c : undefined;
    return __assign(__assign({}, data), { PORT: port, DB_PORT: dbPort, SALT_ROUNDS: saltRounds, DB_USER: user, DB_PASSWORD: password, SECRET_KEY: secretKey });
});
// Parse environment variables and validate against the schema.  Throws an error if validation fails.
exports.env = envSchema.parse(process.env);
