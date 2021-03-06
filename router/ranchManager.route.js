const express = require("express");

const { order, ranchManager, delivery } = require("../controllers");
const { auth } = require("../_middleware");
const route = express.Router();
/**
 * ranch Manger: manage ranch supply
 */
route.post(
  "/ranch-manager-register-supply/:type",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.registerRanchSupply
);
route.post(
  "/acknowledge-supply",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.acknowledgeSupplyDelivery
);
route.get(
  "/ranch-manager-view-ranch-supply",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewRanchSupply
);
route.get(
  "/ranch-manager-view-ranch-vaccine",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewRanchVaccine
);
route.post(
  "/:vaccineId/vaccinateLiveStocks/:liveStockId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.vaccinateLiveStocks
);
route.delete(
  "/deleteLiveStockVaccination/:liveStockVaccFollowUpId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deleteLiveStockVaccinationFollowUp
);
route.patch(
  "/ranch-manager-update-ranch-supply/:type",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.updateSupply
);
route.delete(
  "/ranch-manager-delete-supply",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deleteSupply
);
/**
 * ranch Manager: manage delivery
 */
route.get(
  "/ranch-manager-list-nearby-trucks",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  delivery.listnearbytrucks
);
route.post(
  "/ranch-manager-start-delivery",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  delivery.startDelivery
);
route.patch(
  "/ranch-manager-truck-takeoff/:trackId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  delivery.deliveryLeftOff
);
route.patch(
  "/ranch-manager-acknowledge-delivery",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  delivery.ackdelivery
);
/**
 * ranch Manager: manage local livestock suppliers
 */
route.post(
  "/ranch-manager-register-local-livestock-supplier",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.registerlocallivestocksupplier
);
route.patch(
  "/ranch-manager-update-local-livestock-supplier/:username",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.updatelocallivestocksupplier
);
route.get(
  "/ranch-manager-view-local-livestock-supplier",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewlocallivestocksuppliers
);
route.delete(
  "/ranch-manager-delete-local-livestock-supplier/:id",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deletelocallivestocksupplier
);
/**
 * ranch Manager: manage ranch livestocks
 */
route.post(
  "/ranch-manager-add-livestock/:liveStockSupplierId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.addLivestocks
);
route.get(
  "/ranch-manager-livestocksupplier-livestock-quantity/:liveStockSupplierId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewlocallivestocksupplierLiveStocks
);
route.get(
  "/ranch-manager-livestocksupplier-livestocks/:liveStockSupplierId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewlocallivestockSupplier
);
//
/**
 * ranch Manager request
 */
route.get(
  "/view-livestock-requests",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.viewLiveStockRequests
);
route.post(
  "/order/:productId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  order.preorder,
  order.livestockOrder
);
/**
 * patch
 */
route.put(
  "/selectLiveStocks",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.liveStockShipment
);
/**
 * patch
 */
route.patch(
  "/respond-to-request/:requestId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.respond_to_request
);
/*** */
route.post(
  "/register-deliveryAgent",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.registerdeliveryAgent
);
route.get(
  "/listalldeliveryAgent",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.listalldeliveryagent
);
route.delete(
  "/delete-deliveryAgent",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deleteDeliveryAgent
);
route.patch(
  "/update-deliveryAgent",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.updateDeliveryAgent
);
/**
 * admin: manage delivery agent truck
 */
route.post(
  "/:id/register-deliveryAgent-truck/:truckDriverId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.registerdeliveryAgenttruck
);
route.get(
  "/list-all-deliveryAgent-trucks",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.listalltrucks
);
route.get(
  "/list-all-trucks-of-deliveryAgent",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.listDeliveryAgenttrucks
);
route.patch(
  "/:deliveryAgentId/update-truck/:truckId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.updatetruck
);
route.delete(
  "/:deliveryAgentId/admin-delete-truck/:truckId",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deletetruck
);

route.post(
  "/registerDriver",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.registerDrivers
);

route.get(
  "/listallDriver",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.listDrivers
);
route.delete(
  "/deleteDriver/:username",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deleteuser
);
route.patch(
  "/updateDriver/:username",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.deleteuser
);
route.patch(
  "/updateDriver/:username",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.assign_truckDriver
);

route.patch(
  "/:truckId/updatetruckstate/:state",
  auth.requireSignin,
  auth.authMiddleware,
  auth.checkRanchManager,
  ranchManager.updatetruckState
);
module.exports = route;
