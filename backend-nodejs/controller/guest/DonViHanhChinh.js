import express from "express";
import bodyParser from "body-parser";
import { Axios } from "../../common/utils/axios";

let ObjectID = require("mongodb").ObjectID;
let _configs = require("../../config/preferences");
let constRes = require("../../common/constants/response");
let mwLog = require("../../middlewares/log");

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function getTable(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + "/tbDonViHanhChinh";
  Axios("get", rhApiUrl) //method, url, data
    .then(function (rhApiRes) {
      mwLog.updateLogApi(req, { status: rhApiRes.status, body: rhApiRes.data });
      res.status(rhApiRes.status).send(rhApiRes.data);
    })
    .catch(function (rhApiErr) {
      try {
        mwLog.updateLogApi(req, {
          status: rhApiErr.response.status,
          body: rhApiErr.response.data,
        });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res
          .status(constRes.RESPONSE_ERR_DATABASE.status)
          .send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    });
}

export { getTable };
