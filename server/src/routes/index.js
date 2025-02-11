"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var loginRoute_1 = require("./auth/loginRoute");
var usersRoute_1 = require("./usersRoute");
var registrationRoute_1 = require("./auth/registrationRoute");
var router = express_1.default.Router();
// Mount all API routes under /api
router.use('/register', registrationRoute_1.default);
router.use('/login', loginRoute_1.default);
router.use('/users', usersRoute_1.default);
exports.default = router;
