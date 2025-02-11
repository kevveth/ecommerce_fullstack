"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Router for registering a new user.
var express_1 = require("express");
var user_validation_1 = require("../../validation/user.validation");
var register_1 = require("../../controller/register");
var router = express_1.default.Router();
router.post("/", user_validation_1.validateRegistrationData, register_1.registerUser);
exports.default = router;
