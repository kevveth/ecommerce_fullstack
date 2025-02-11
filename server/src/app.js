"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var express_1 = require("express");
require("express-async-errors");
var express_session_1 = require("express-session");
var cors_1 = require("cors");
var index_1 = require("./routes/index");
var errors_1 = require("./middleware/errors");
var passport_mw_1 = require("./middleware/passport.mw");
var env_1 = require("./utils/env");
var corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
};
var port = env_1.env.PORT || 3001;
// Express initialization
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: env_1.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));
(0, passport_mw_1.initPassport)(app);
// Routes
app.get('/', function (req, res) {
    res.send("Hello World!");
});
app.use('/api', index_1.default);
app.get('/api/user', passport_mw_1.isAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send({ user: req.user });
        return [2 /*return*/];
    });
}); });
// Error Handling
app.use(errors_1.errorHandler);
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
exports.default = app;
