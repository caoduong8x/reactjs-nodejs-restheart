import express from 'express'
import bodyParser from 'body-parser'
import { checkSuperAccount } from '../common/utils/token';

let ObjectID = require('mongodb').ObjectID

let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');
let moduleApi = require('../common/constants/moduleApi');
let mwLog = require('../middlewares/log');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function get(req, res) {
  let account = req.tokenObj.usr.account
  if (!checkSuperAccount(account)) {// chỉ SuperAccount
    mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  }
  let rhApiRes = {
    data: {
      _embedded: moduleApi.CONTROLER,
      _id: _configs.mongodb.db,
      _size: moduleApi.CONTROLER.length,
      _total_pages: 1,
      _returned: moduleApi.CONTROLER.length
    },
    status: 200
  }
  mwLog.updateLogApi(req, { status: rhApiRes.status, body: rhApiRes.data });
  res.status(rhApiRes.status).send(rhApiRes.data);
}

export { get }