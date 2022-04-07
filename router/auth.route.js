const express = require("express");
const { auth } = require("../controllers");
const { adminAuth: adminAuthCtrl } = require("../admin-controller");
const { authAdmin } = require("../_middleware");
const route = express.Router();
/**
 * admin route
 */
route.post("/admin-signup", authAdmin.checkRecord, adminAuthCtrl.adminSignup);
route.post("/admin-signin", adminAuthCtrl.adminSignin);
route.get("/signout", adminAuthCtrl.signout);
route.get("/admin-forgotPassword", adminAuthCtrl.adminforgotPassword);
/**
 * users route
 */
route.post("/pre-signup",auth.preSignup );
route.post("/signup", auth.signup);
route.post("/signin", auth.signin);
route.put("/forgot-password", auth.forgotPassword);

module.exports = route;
