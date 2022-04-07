const express = require("express");
const controllers = require("../controllers");
const { activity, order } = controllers;
const route = express.Router();
/**
 * get 
 */
// route.get("/prerequest", activity.listRanch);
// route.get("/listallgrantedreqeuest", activity.listallgrantedreqeuest);
// route.get("/listallapprovedrequests", );
/**
 * post
 */
route.post("/:ranchname/preorder/:requestType", order.preorder);
/**
 * patch
 */
route.patch("/:ranch/approverequest/:request", activity.approverequest);
module.exports = route