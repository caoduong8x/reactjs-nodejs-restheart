import express from "express";
import bodyParser from "body-parser";
import util from "util";

let _aggr = require("../../model/aggrs/donvihanhchinh");
let mwLog = require("../../middlewares/log");
let _configs = require("../../config/preferences");
let constRes = require("../../common/constants/response");

// connectmongo
var mgClient = require("mongodb").MongoClient;

let router = express.Router();
router.use(bodyParser.json());

function test(req, res) {
  mgClient.connect(
    _configs.mgUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, client) {
      if (err) {
        mwLog.updateLogApi(req, constRes.RESPONSE_ERR_DATABASE);
        res
          .status(constRes.RESPONSE_ERR_DATABASE.status)
          .send(constRes.RESPONSE_ERR_DATABASE.body);
      } else {
        client
          .db(_configs.mongodb.db)
          .collection("tbDonViHanhChinh")
          .aggregate(_aggr.getData())
          .toArray()
          .then(
            function (v) {
              client.close();
              mwLog.updateLogApi(req, v);
              res.status(200).send({ size: v.length, data: v });
            },
            function (e) {
              client.close();
              mwLog.updateLogApi(req, e);
              res
                .status(constRes.RESPONSE_ERR_DATABASE.status)
                .send(constRes.RESPONSE_ERR_DATABASE.body);
            }
          );
      }
    }
  );
}

export { test };
