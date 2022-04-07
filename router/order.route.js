const express = require("express");

const { order } = require("../controllers");
const route = express.Router();

route.post("/order/:productId", order.preorder, order.livestockOrder);


module.exports = route;
