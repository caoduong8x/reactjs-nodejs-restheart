
import { Axios } from "./axios"
import { TB_CURRENT_PERMISSION, DATA, HOST_API } from '../api'
import { __DEV__ } from "../../common/ulti/constants";


function getById(id) {
  return Axios('get', `${HOST_API}${DATA}${TB_CURRENT_PERMISSION}${'/'}${id}`)
}


export { getById }