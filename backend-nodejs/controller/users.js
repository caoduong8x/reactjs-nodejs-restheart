import * as utils from '../common/utils'
import express from 'express'
import bodyParser from 'body-parser';
import { updateMulti } from '../common/utils/filter';
import { Axios } from '../common/utils/axios';
import { checkSuperAccount, comparePassword, encryptPassword } from '../common/utils/token';

let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');
let _configs = require('../config/preferences');

let router = express.Router();
router.use(bodyParser.json());


function changeProfile(req, res) {
  let account = req.tokenObj.usr.account
  let idUsr = req.tokenObj.usr._id.$oid
  let query = req.params.query

  let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";

  if (checkSuperAccount(account) && idUsr === query) {
    mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {

    Axios('get', userApiUrl)//method, url, data
      .then(function (userApiRes) {
        if (userApiRes.status == 200 && userApiRes.data._returned) {
          let user = userApiRes.data._embedded[0];
          let idUser = user._id.$oid || user._id
          let rhApiUrl = _configs.rh.dataUrl + "/tbUsers/" + query

          if (idUser !== query) {
            mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
            res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
          }

          if (req.body.cur_pwd && comparePassword(req.body.cur_pwd, user.pwd)) {
            req.body.pwd = encryptPassword(req.body.new_pwd)
          }

          req.body.modifiedAt = new Date().getTime();
          req.body.modifiedBy = req.tokenObj.usr.account;

          delete req.body.cur_pwd
          delete req.body.new_pwd
          delete req.body.re_new_pwd
          delete req.body.account
          delete req.body.code

          Axios('patch', rhApiUrl, req.body)
            .then(function (rhApiRes) {
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
        } else {
          mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
          res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
        }
      }).catch(function (err) {
        mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
        res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
      });
  }
}

function update(req, res) {
  req.body.modifiedAt = new Date().getTime();
  req.body.modifiedBy = req.tokenObj.usr.account;
  if (req.body.pwd)
    req.body.pwd = encryptPassword(req.body.pwd)

  let rhApiUrl = _configs.rh.dataUrl + "/tbUsers/" + req.params.query
  let body = JSON.parse(JSON.stringify(req.body))

  delete req.body.code
  delete body.pwd

  Axios('patch', rhApiUrl, req.body)//method, url, data
    .then(async function (rhApiRes) {

      // update multi
      await updateMulti('tbNhomQuyenNguoiDung', { 'NguoiDung.code': body.code }, { 'NguoiDung': body })
      // hết update multi

      mwLog.updateLogApi(req, { status: rhApiRes.status, body: rhApiRes.data });
      res.status(rhApiRes.status).send(rhApiRes.data);
    }).catch(function (err) {
      try {
        mwLog.updateLogApi(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    })
}

export { changeProfile, update }
