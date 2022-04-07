const auth = require("./auth.route");
const admin = require("./admin.route")
const activities = require("./activities.route")
const ranchManager = require("./ranchManager.route")
const order = require('./order.route')
const inspector = require('./inspector.route')
const Routers = {
  auth, admin, activities, ranchManager, order, inspector
};
module.exports = Routers;