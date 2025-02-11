"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var Pool = pg_1.default.Pool;
var pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
var query = function (text, params) {
    if (params === void 0) { params = []; }
    return pool.query(text, params);
};
exports.query = query;
