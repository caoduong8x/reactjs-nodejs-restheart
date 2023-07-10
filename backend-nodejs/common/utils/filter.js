let _configs = require('../../config/preferences');
import * as utils from './index'
import { regexText } from './regex';

async function updateMulti(table, filter, data) {
  let rhApiUrl = _configs.rh.dataUrl + "/" + table + "/*?filter=" + JSON.stringify(filter);
  let apiRes = await utils.Axios('patch', rhApiUrl, data)
    .then(function (rhApiRes) {
      return true
    }).catch(function (rhApiErr) {
      return false
    })
  return apiRes
}

async function checkIsExisted(table, key, value) {
  let rhApiUrl = _configs.rh.dataUrl + "/" + table + "?filter={isActive : true," + key + ":'" + value + "'}";;
  let apiRes = await utils.Axios('get', rhApiUrl)
    .then(function (rhApiRes) {
      return rhApiRes.data._embedded[0]
    }).catch(function (rhApiErr) {
      return false
    })
  return !!apiRes
}

function convertQuery(query) {
  return new URLSearchParams(query).toString()
}

export {
  checkIsExisted, updateMulti,
  convertQuery
}