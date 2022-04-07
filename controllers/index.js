const auth = require("./userAuthentication");
const order = require("./order.controller");
const activity = require("./actvity.controller");
const delivery = require("./delivery.controller");
const ranchManager = require("./ranchManager.controller");
const inspector = require('./inspector.controller')
const controllers = {
  auth,
  order,
  delivery,
  activity,
  inspector,
  ranchManager,
};
module.exports = controllers;
