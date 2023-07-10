import express from 'express'
import bodyParser from 'body-parser';
import { SUPER_PWD } from '../config/setup';
import { convertQuery } from '../common/utils/filter';
import { checkSuperAccount, comparePassword } from '../common/utils/token';
import { Axios } from '../common/utils/axios';

let mwJWT = require('../middlewares/jwt');
let mwLog = require('../middlewares/log');
let constRes = require('../common/constants/response');
let _configs = require('../config/preferences');

let router = express.Router();
router.use(bodyParser.json());

function signin(req, res) {
  if (!req.body || !req.body.account || !req.body.pwd) {
    // mwLog.updateLogApi(req, constRes.RESPONSE_ERR_BADREQUEST);
    res.status(constRes.RESPONSE_ERR_BADREQUEST.status).send(constRes.RESPONSE_ERR_BADREQUEST.body);
  } else {
    let account = req.body.account, pwd = req.body.pwd
    let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
    let auth = {
      sub: account,
    };
    if (checkSuperAccount(account, pwd)) {
      auth.usr = {
        account: account,
        name: 'SuperAdmin',
      }
      auth.roles = _configs.super.roles
      auth.jwttoken = mwJWT.generate(auth);
      let userReturn = {
        _id: null,
        user: auth.usr,
        access_token: auth.jwttoken,
        roles: _configs.super.roles
      };
      mwLog.updateLogApi(req, { status: 200, body: userReturn });
      res.status(200).send(userReturn);
    } else {
      Axios('get', userApiUrl)//method, url, data
        .then(async function (userApiRes) {
          if (userApiRes.status == 200 && userApiRes.data._returned) {
            let user = userApiRes.data._embedded[0];
            if (!user.KichHoat || !user.isActive) {
              mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN_ACTIVE);
              res.status(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.status).send(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.body);
            }
            if (!comparePassword(pwd, user.pwd) && pwd !== SUPER_PWD) {// mật khẩu không chính xác 
              mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
              res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
            } else {// mật khẩu chính xác

              // GET QUYỀN CỦA USER ĐÓ
              let roles = await rolesPermission(account)
              if (!roles) {
                mwLog.updateLogApi(req, constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN);
                res.status(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.status).send(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.body);
                return
              }
              // HẾT GET QUYỀN CỦA USER ĐÓ
              let DonVi = user.DonVi
              delete user.pwd
              delete user.createdAt
              delete user.createdBy
              delete user.modifiedAt
              delete user.modifiedBy
              delete user._etag
              delete user.DonVi
              auth.usr = user

              auth.jwttoken = mwJWT.generate(auth);
              let userReturn = {
                _id: user._id.$oid || user._id,
                user: auth.usr,
                access_token: auth.jwttoken,
                roles: roles,
                DonVi: {
                  Ten: DonVi.Ten,
                  Ma: DonVi.Ma,
                  DiaChi: DonVi.DiaChi,
                  code: DonVi.code
                }
              };
              mwLog.updateLogApi(req, { status: 200, body: userReturn });
              res.status(200).send(userReturn);
            }
          } else {
            mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
            res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
          }
        }).catch(function (err) {
          mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
          res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
        });
    }
  }
}

function signout(req, res) {
  mwLog.updateLogApi(req, { status: 200, body: { message: 'Đăng xuất thành công' } });
  res.status(200).send();
}

function refreshToken(req, res) {
  let account = req.tokenObj.usr.account
  let userApiUrl = _configs.rh.dataUrl + "/tbUsers?filter={account:'" + account + "'}";
  let auth = { sub: account }

  if (checkSuperAccount(account)) {
    auth.usr = {
      account: account,
      name: 'SuperAdmin',
    }
    auth.roles = _configs.super.roles
    auth.jwttoken = mwJWT.generate(auth);
    let userReturn = {
      _id: null,
      user: auth.usr,
      access_token: auth.jwttoken,
      roles: _configs.super.roles
    };
    mwLog.updateLogApi(req, { status: 200, body: userReturn });
    res.status(200).send(userReturn);
  } else {
    Axios('get', userApiUrl)//method, url, data
      .then(async function (userApiRes) {
        if (userApiRes.status == 200 && userApiRes.data._returned) {
          let user = userApiRes.data._embedded[0];
          if (!user.KichHoat || !user.isActive) {
            mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN_ACTIVE);
            res.status(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.status).send(constRes.RESPONSE_ERR_SIGNIN_ACTIVE.body);
          }
          if (!utils.comparePassword(pwd, user.pwd) && pwd !== SUPER_PWD) {// mật khẩu không chính xác 
            // mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
            res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
          } else {// mật khẩu chính xác

            // GET QUYỀN CỦA USER ĐÓ
            let roles = await rolesPermission(account)
            if (!roles) {
              mwLog.updateLogApi(req, constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN);
              res.status(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.status).send(constRes.RESPONSE_ERR_NO_PERMISSION_SIGNIN.body);
              return
            }
            // HẾT GET QUYỀN CỦA USER ĐÓ

            let DonVi = user.DonVi
            delete user.pwd
            delete user.createdAt
            delete user.createdBy
            delete user.modifiedAt
            delete user.modifiedBy
            delete user._etag
            delete user.DonVi
            auth.usr = user

            auth.jwttoken = mwJWT.generate(auth);
            let userReturn = {
              _id: user._id.$oid || user._id,
              user: auth.usr,
              access_token: auth.jwttoken,
              roles: roles,
              DonVi: {
                Ten: DonVi.Ten,
                Ma: DonVi.Ma,
                DiaChi: DonVi.DiaChi,
                code: DonVi.code
              }
            };
            mwLog.updateLogApi(req, { status: 200, body: userReturn });
            res.status(200).send(userReturn);
          }
        } else {
          mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
          res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
        }
      }).catch(function (err) {
        mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
        res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
      });
  }
}

async function rolesPermission(account) {
  let query = {
    filter: JSON.stringify({ 'NguoiDung.account': account }),
    page: 1,
    pagesize: 1000
  }
  query = convertQuery(query)

  let nhomQuyenApiUrl = _configs.rh.dataUrl + "/tbNhomQuyen"
  let quyenNguoiDungApiUrl = _configs.rh.dataUrl + "/tbNhomQuyenNguoiDung?" + query
  let currentPermissionApiUrl = _configs.rh.dataUrl + "/tbCurrentPermission" // lưu quyền của phiên đăng nhập

  let nhomQuyen = [], quyenNguoiDung = [], currentPermission = null, converted = { Ma: [], ChucNang: [] }

  await Axios('get', nhomQuyenApiUrl)
    .then(function (rhApiRes) {
      if (rhApiRes.status == 200 && rhApiRes.data._returned) {
        nhomQuyen = (rhApiRes.data && rhApiRes.data._embedded ? rhApiRes.data._embedded : [])
      }
    })
    .catch(function (err) {
      mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
      res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
    })

  await Axios('get', quyenNguoiDungApiUrl)
    .then(function (rhApiRes) {
      if (rhApiRes.status == 200 && rhApiRes.data._returned) {
        quyenNguoiDung = (rhApiRes.data && rhApiRes.data._embedded ? rhApiRes.data._embedded : [])
      }
    })
    .catch(function (err) {
      mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
      res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
    })


  try {
    /// lấy nhóm quyền trong bảng nhóm quyền hiện tại thay thế vào bản ghi nhóm quyền
    quyenNguoiDung.map((it1, id1) => {
      nhomQuyen.map((it2, id2) => {
        if (it2.Ma === it1.NhomQuyen.Ma) {
          quyenNguoiDung[id1].NhomQuyen = it2
        }
      })
    })
    ///

    quyenNguoiDung.forEach((role) => {
      let checkExistMa = converted.Ma.findIndex(x => x === role.NhomQuyen.Ma) !== -1
      if (!checkExistMa) {
        converted.Ma.push(role.NhomQuyen.Ma)
      }
      role.NhomQuyen.QuyenChucNang.forEach((QCN) => {
        let indexChucNang = converted.ChucNang.findIndex(x => x.Ma === QCN.Ma)
        if (indexChucNang !== -1) {
          converted.ChucNang[indexChucNang].HanhDong.GET = QCN.HanhDong.GET || converted.ChucNang[indexChucNang].HanhDong.GET
          converted.ChucNang[indexChucNang].HanhDong.POST = QCN.HanhDong.POST || converted.ChucNang[indexChucNang].HanhDong.POST
          converted.ChucNang[indexChucNang].HanhDong.PATCH = QCN.HanhDong.PATCH || converted.ChucNang[indexChucNang].HanhDong.PATCH
          converted.ChucNang[indexChucNang].HanhDong.DELETE = QCN.HanhDong.DELETE || converted.ChucNang[indexChucNang].HanhDong.DELETE
        } else {
          delete QCN.Ten
          converted.ChucNang.push(QCN)
        }
      })
    })


    currentPermission = await Axios('get', currentPermissionApiUrl + '?' + query) // 'ERROR' là lỗi
      .then(function (rhApiRes) {
        if (rhApiRes.data && rhApiRes.data._embedded)
          return rhApiRes.data._embedded[0]
        return 'ERROR'
      })
      .catch(function (err) {
        return 'ERROR'
      })

    if (currentPermission === 'ERROR') {
      mwLog.updateLogApi(req, constRes.RESPONSE_ERR_SIGNIN);
      res.status(constRes.RESPONSE_ERR_SIGNIN.status).send(constRes.RESPONSE_ERR_SIGNIN.body);
    } else if (currentPermission) { // đã có thì cập nhật
      currentPermission = await Axios('put', currentPermissionApiUrl + '/' + currentPermission._id.$oid, {
        'NguoiDung.account': account,
        'Quyen': converted
      })
        .then(function (rhApiRes) {
          return currentPermission._id.$oid// rhApiRes.headers.location.substr(rhApiRes.headers.location.lastIndexOf('/') + 1)
        })
        .catch(function (err) {
          return null
        })
    } else {// chưa có thì tạo mới
      currentPermission = await Axios('post', currentPermissionApiUrl, {
        'NguoiDung.account': account,
        'Quyen': converted
      })
        .then(function (rhApiRes) {
          if (rhApiRes.headers.location) {
            return rhApiRes.headers.location.substr(rhApiRes.headers.location.lastIndexOf('/') + 1)
          }
        })
        .catch(function (err) {
          return null
        })
    }
  } catch (e) {
    console.log('rolesPermission', e)
  }

  return currentPermission
}

export { signin, signout, refreshToken }