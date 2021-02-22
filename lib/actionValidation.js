"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * checks if the context auth token has any of the allowed roles
 * @param {string[]} authorizedRoles custom claim roles that are allowed to run.
 * @param {CallableContext} context callable context used to verify the user
 * @return {boolean} boolean
 */
var hasAnyAuthorizedRole = function (authorizedRoles, context) {
    if (!context.auth || !context.auth.token.roles)
        return false;
    var userRoles = context.auth.token.roles;
    return userRoles.some(function (v) { return authorizedRoles.includes(v); });
};
/**
 * checks for required but missing fields
 * @param {FirebaseFirestore.DocumentData} row document snapshot data
 * @return {string[]} an array of field keys missing from the row
 */
var missingFieldsReducer = function (row) { return function (missingFields, requiredField) {
    if (row[requiredField] === undefined || row[requiredField] === null) {
        return __spreadArrays(missingFields, [requiredField]);
    }
    else
        return missingFields;
}; };
var validateAction = function (_a) {
    var context = _a.context, row = _a.row, schemaSnapshot = _a.schemaSnapshot, column = _a.column;
    var _b = schemaSnapshot.get("columns." + column.key + ".config"), requiredRoles = _b.requiredRoles, requiredFields = _b.requiredFields;
    if (!requiredRoles || requiredRoles.length === 0) {
        throw Error("You need to specify at least one role to run this action");
    }
    if (!hasAnyAuthorizedRole(requiredRoles, context)) {
        throw Error("You don't have the required roles to run this action");
    }
    var missingRequiredFields = requiredFields
        ? requiredFields.reduce(missingFieldsReducer(row), [])
        : [];
    if (missingRequiredFields.length > 0) {
        throw new Error((missingRequiredFields.length === 1
            ? missingRequiredFields[0] + " field is"
            : missingRequiredFields.join(", ") + " fields are") + " required and missing from this row");
    }
    return true;
};
exports.default = validateAction;
