import express from "express";
import bodyParser from "body-parser";
import * as controller from "../controller/data";

let tbDanhMucUngDungRouter = require("./data/tbDanhMucUngDung");
let tbDonViRouter = require("./data/tbDonVi");
let tbDonViHanhChinhRouter = require("./data/tbDonViHanhChinh");
let tbLogApiRouter = require("./data/tbLogApi");
let tbMenuRouter = require("./data/tbMenu");
let tbNhomQuyenRouter = require("./data/tbNhomQuyen");
let tbNhomQuyenNguoiDungRouter = require("./data/tbNhomQuyenNguoiDung");
let tbUsersRouter = require("./data/tbUsers");
let tbCurrentPermissionRouter = require("./data/tbCurrentPermission");

let mwJWT = require("../middlewares/jwt");
let mwLog = require("../middlewares/log");
let mwJson = require("../middlewares/json");

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/tbDanhMucUngDung", tbDanhMucUngDungRouter);
router.use("/tbDonVi", tbDonViRouter);
router.use("/tbDonViHanhChinh", tbDonViHanhChinhRouter);
router.use("/tbLogApi", tbLogApiRouter);
router.use("/tbMenu", tbMenuRouter);
router.use("/tbNhomQuyen", tbNhomQuyenRouter);
router.use("/tbNhomQuyenNguoiDung", tbNhomQuyenNguoiDungRouter);
router.use("/tbUsers", tbUsersRouter);
router.use("/tbCurrentPermission", tbCurrentPermissionRouter);

router.get(
  "/",
  mwJWT.checkApiAuthorization,
  mwLog.generateLogApi,
  controller.get
);

module.exports = router;
