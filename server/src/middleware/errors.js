"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var CustomError_1 = require("../errors/CustomError");
var zod_validation_error_1 = require("zod-validation-error");
var errorHandler = function (err, req, res, next) {
    if (err instanceof CustomError_1.CustomError) {
        // Handled Errors
        var statusCode = err.statusCode, errors = err.errors, logging = err.logging;
        if (logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack,
            }, null, 2));
        }
        res.status(statusCode).send({ errors: errors });
    }
    else if ((0, zod_validation_error_1.isZodErrorLike)(err)) {
        console.log((0, zod_validation_error_1.fromZodError)(err).toString());
        res.status(400).json({ errors: err });
    }
    else {
        // Unhandled Errors
        console.error(JSON.stringify(err, null, 2));
        res
            .status(500)
            .send({ errors: [{ message: "Something went wrong!" }] });
    }
};
exports.errorHandler = errorHandler;
