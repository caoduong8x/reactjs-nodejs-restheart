import express from 'express'
import bodyParser from 'body-parser'
import { Axios } from '../common/utils/axios';
import { isObjEmpty } from '../common/utils/object';
import { encryptPassword } from '../common/utils/token';

let ObjectID = require('mongodb').ObjectID
let _configs = require('../config/preferences');
let constRes = require('../common/constants/response');
let mwLog = require('../middlewares/log');

let router = express.Router();

router.use(bodyParser.json());

function checkAccount(req, res) {
  let account = req.body.account
  if (isObjEmpty(account)) {
    mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  }
  else {
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    Axios('get', rhApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200) {
          if (userApiRes.data._returned) {
            let result = {
              status: 200,
              body: {
                account_existed: true,
                message: 'Tài khoản đã tồn tại'
              }
            }
            mwLog.updateLogApi(req, result);
            res.status(result.status).send(result.body);
          } else {
            let result = {
              status: 200,
              body: {
                account_existed: false,
                message: 'Tài khoản chưa tồn tại'
              }
            }
            mwLog.updateLogApi(req, result);
            res.status(result.status).send(result.body);
          }
        } else {
          mwLog.updateLogApi(req, constRes.RESPONSE_ERR_DATABASE);
          res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        }
      }).catch(function (rhApiErr) {
        mwLog.updateLogApi(req, constRes.RESPONSE_ERR_DATABASE);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
  }
}

function create(req, res) {
  let account = req.body.account, pwd = req.body.pwd
  if (isObjEmpty(account) || isObjEmpty(pwd)) {
    mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {
    let rhApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let usersApiUrl = _configs.rh.dataUrl + "/tbUsers";

    Axios('get', rhApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200) {
          if (userApiRes.data._returned) {
            let result = {
              status: 400,
              body: {
                account_existed: true,
                message: 'Tài khoản đã tồn tại'
              }
            }
            mwLog.updateLogApi(req, result);
            res.status(result.status).send(result.body);
          } else {
            req.body.createdAt = new Date().getTime();
            req.body.createdBy = account;
            req.body.isActive = true;
            req.body.pwd = encryptPassword(pwd)
            req.body.code = new ObjectID().toHexString()

            Axios('post', usersApiUrl, req.body)//method, url, data
              .then(function (rhApiRes) {
                if (rhApiRes.headers.location) {
                  delete req.body.pwd
                  rhApiRes.data = req.body;
                }
                mwLog.updateLogApi(req, { status: rhApiRes.status, body: rhApiRes.data });
                res.status(rhApiRes.status).send(rhApiRes.data);
              }).catch(function (rhApiErr) {
                try {
                  mwLog.updateLogApi(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
                  res.status(rhApiErr.response.status).send(rhApiErr.response.data);
                } catch (e) {
                  res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
                }
              })
          }
        } else {
          mwLog.updateLogApi(req, constRes.RESPONSE_ERR_DATABASE);
          res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
        }
      }).catch(function (rhApiErr) {
        mwLog.updateLogApi(req, constRes.RESPONSE_ERR_DATABASE);
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      })
  }
}

function getOtp(req, res) {

}

function verifyOtp(req, res) {

}

export { checkAccount, create, getOtp, verifyOtp }