const express = require("express");
const { order, inspector, delivery } = require("../controllers");
const { auth } = require("../_middleware");
const route = express.Router();

/**
 * inspectors view livestocks
 */
route.get(
  "/viewAllRanches",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewAllRanches
);
route.get(
  "/viewRanch/:ranchId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewRanch
);
route.get(
  "/:ranchId/viewLiveStock/:liveStockId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewLiveStock
);
route.get(
  "/viewAllVaccine",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewAllVaccine
);
route.get(
  "/viewVaccine/:vaccineId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewVaccine
);
route.get(
  "/viewAllMedicine",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewAllMedicine
);
route.get(
  "/viewMedicine/:medicineId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewMedicine
);
route.get(
  "/viewAllProteins",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewAllProteins
);
route.get(
  "/viewProteins/:proteinId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.viewProtein
);
route.get(
  "/viewtotalLiveStocks",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.totalLiveStocks
);
route.get(
  "/viewtotalLiveStocksByResidence/:residence",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.totalLiveStocksByResidence
);
route.get(
  "/:ranchId/viewtotalRanchLiveStocks",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.totalRanchLiveStocks
);
route.get(
  "/:ranchId/viewtotalRanchLiveStocksByResidence/:residence",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkInspector,
  inspector.totalRanchLiveStocksByResidence
);
module.exports = route;
