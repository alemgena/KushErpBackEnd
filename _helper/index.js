let { errorHandler } = require("./errorHandler");
let { notifyUser, sendData, notifyUserSucc } = require("./notificationHandler");
let { omitNullValues, omitNullValuesObj } = require("./intermidateFunctions");
const helperFunction = {
  errorHandler,
  notifyUser,
  sendData,
  omitNullValues,
  omitNullValuesObj,
  notifyUserSucc,
};

module.exports = helperFunction;
