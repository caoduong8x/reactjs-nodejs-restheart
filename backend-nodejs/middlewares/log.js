import axios from 'axios'
import * as svCommon from '../common/utils/token'

const globalConfig = require('../config/preferences');

const mwLog = {
  generateLogApi: async (req, res, next) => {
    let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogApi';
    let logObj = {
      user: {
        account: req.tokenObj && req.tokenObj.sub ? req.tokenObj.sub : '',
        ip: req.ip,
      },
      request: {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        timestamp: req.timestamp,
        headers: req.headers,
        cookies: req.cookies ? req.cookies : null,
        body: req.body ? req.body : null,
        type: "LOG_API"
      },
      isActive: true,
      createdAt: Date.now()
    };

    let rhLogApiId = await axios.post(rhLogUrl, logObj, {
      headers: {
        'Authorization': 'Basic ' + svCommon.getAccessToken(),
        'Content-Type': 'application/json',
        'Accept-Charset': 'UTF-8'
      }
    }).then(function (rhLogRes) {
      let logApiId = null
      if (rhLogRes.headers.location) {
        logApiId = rhLogRes.headers.location.substr(rhLogRes.headers.location.lastIndexOf('/') + 1)
      }
      return logApiId
    }).catch(function (rhLogErr) {
      return null
    });
    req.logApiId = rhLogApiId
    next()
  },
  updateLogApi: async (req, res, next) => {
    let logApiId = req.logApiId
    if (!logApiId) return
    let logObj = {
      response: {
        status: res.status ? res.status : null,
        message: res.message ? res.message : null,
        headers: res.headers ? res.headers : null,
        body: res.body ? res.body : null,
        cookies: res.cookies ? res.cookies : null,
        timestamp: Date.now()
      },
      isActive: true,
      modifiedAt: Date.now()
    };

    let rhLogUrl = globalConfig.rh.dataUrl + '/tbLogApi/' + logApiId;
    axios.patch(rhLogUrl, logObj, {
      headers: {
        'Authorization': 'Basic ' + svCommon.getAccessToken(),
        'Content-Type': 'application/json',
        'Accept-Charset': 'UTF-8'
      }
    }).then(function (rhLogRes) {

    }).catch(function (rhLogErr) {

    });
  },
}

module.exports = mwLog;