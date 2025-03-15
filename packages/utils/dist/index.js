"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  isValidEmail: () => isValidEmail,
  isValidPassword: () => isValidPassword,
  useLocalStorage: () => useLocalStorage
});
module.exports = __toCommonJS(src_exports);

// src/hooks/index.ts
var useLocalStorage = (key, initialValue) => {
};

// src/validators/index.ts
var isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
var isValidPassword = (password) => {
  return password.length >= 8;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValidEmail,
  isValidPassword,
  useLocalStorage
});
