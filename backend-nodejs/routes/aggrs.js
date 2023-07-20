import express from "express";
import bodyParser from "body-parser";
import * as controller from "../controller/data";

let aggrsDonViRouter = require("./aggrs/donvi");
let aggrsDonViHanhChinhRouter = require("./aggrs/donvihanhchinh");

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/don-vi", aggrsDonViRouter);
router.use("/don-vi-hanh-chinh", aggrsDonViHanhChinhRouter);

module.exports = router;
