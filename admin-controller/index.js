const adminAuth = require("./adimnAuth");
const admin_manageUser = require("./admin-user.controller");
const admin_manageRanch = require("./admin-ranch.controller");
const admin_manageSupply = require("./admin-ranchSupply.controller");
const admin_manageRequest = require("./admin-request.controller");
const admin_manageliveStock = require("./admin-livestock.controller");
const admin_managedeliveryAgent = require("./admin-deliveryAgent.controller");
const admin_manageDeliveryAgenttruck = require("./admin-deliveryAgent-truck.controller");
const admin_govOffice = require("./admin-govOffice.controller");
const controllers = {
  adminAuth,
  admin_manageUser,
  admin_manageRanch,
  admin_govOffice,
  admin_manageSupply,
  admin_manageRequest,
  admin_manageliveStock,
  admin_managedeliveryAgent,
  admin_manageDeliveryAgenttruck,
};
module.exports = controllers;
