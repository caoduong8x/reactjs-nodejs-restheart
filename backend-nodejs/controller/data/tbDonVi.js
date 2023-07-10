import express from 'express'
import bodyParser from 'body-parser'
import { checkIsExisted, updateMulti } from '../../common/utils/filter';
import { Axios } from '../../common/utils/axios';

let ObjectID = require('mongodb').ObjectID

let _configs = require('../../config/preferences');
let constRes = require('../../common/constants/response');
let mwLog = require('../../middlewares/log');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


async function getTable(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url
  Axios('get', rhApiUrl)//method, url, data
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
}

async function post(req, res) {
  //Kiểm tra dữ liệu với Mã đã tồn tại hay chưa
  let checkIsEx = await checkIsExisted('tbDonVi', 'Ma', req.body.Ma)
  if (checkIsEx) {
    mwLog.updateLogApi(req, { status: constRes.RESPONSE_ERR_CODE_EXITSTED.status, body: constRes.RESPONSE_ERR_CODE_EXITSTED.body });
    res.status(constRes.RESPONSE_ERR_CODE_EXITSTED.status).send(constRes.RESPONSE_ERR_CODE_EXITSTED.body);
    return
  }//Hết kiểm tra
  req.body.createdAt = new Date().getTime();
  req.body.createdBy = req.tokenObj.usr.account;
  req.body.code = new ObjectID().toHexString()
  req.body.isActive = true
  if (req.body.DonViCha) {
    req.body.codeTree = `${req.body.DonViCha.codeTree || ""}.${req.body.Ma}`
  } else {
    req.body.codeTree = req.body.Ma
  }
  // return
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url;
  Axios('post', rhApiUrl, req.body)//method, url, data
    .then(function (rhApiRes) {
      if (rhApiRes.headers.location) {
        rhApiRes.data = {
          newId: rhApiRes.headers.location.substr(rhApiRes.headers.location.lastIndexOf('/') + 1)
        };
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

function put(req, res) {
  req.body.modifiedAt = new Date().getTime();
  req.body.modifiedBy = req.tokenObj.usr.account;
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url;
  Axios('put', rhApiUrl, req.body)//method, url, data
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
}

function patch(req, res) {
  req.body.modifiedAt = new Date().getTime();
  req.body.modifiedBy = req.tokenObj.usr.account;
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url;
  let body = JSON.parse(JSON.stringify(req.body))
  delete req.body.code
  Axios('patch', rhApiUrl, req.body)//method, url, data
    .then(async function (rhApiRes) {
      //update multi
      await updateMulti('tbUsers', { 'DonVi.code': body.code }, { 'DonVi': body })
      // await updateMulti('tbLinhVuc', { 'DonViCha.code': body.code }, { 'DonViCha': body })
      // await updateMulti('tbDanhMuc', { 'DonViCha.code': body.code }, { 'DonViCha': body })
      // await updateMulti('tbDanhMuc', { 'LinhVuc.DonViCha.code': body.code }, { 'LinhVuc.DonViCha': body })
      await updateMulti('tbDonVi', { 'DonViCha.code': body.code }, { 'DonViCha': body })
      //hết update multi
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

function deleteTable(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url;
  Axios('delete', rhApiUrl)//method, url, data
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
}

function lock(req, res) {
  let rhApiUrl = _configs.rh.dataUrl + '/tbDonVi' + req.url;
  Axios('get', rhApiUrl)//method, url, data
    .then(function (rhApiRes) {
      Axios('patch', rhApiUrl, { isActive: false })//method, url, data
        .then(function (dataApiRes) {
          mwLog.updateLogApi(req, { status: dataApiRes.status, body: dataApiRes.data });
          res.status(dataApiRes.status).send(dataApiRes.data);
        }).catch(function (rhApiErr) {
          mwLog.updateLogApi(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
          res.status(rhApiErr.response.status).send(rhApiErr.response.data);
        })
    }).catch(function (rhApiErr) {
      try {
        mwLog.updateLogApi(req, { status: rhApiErr.response.status, body: rhApiErr.response.data });
        res.status(rhApiErr.response.status).send(rhApiErr.response.data);
      } catch (e) {
        res.status(constRes.RESPONSE_ERR_DATABASE.status).send(constRes.RESPONSE_ERR_DATABASE.body);
      }
    })
}

export { getTable, post, patch, put, deleteTable, lock }