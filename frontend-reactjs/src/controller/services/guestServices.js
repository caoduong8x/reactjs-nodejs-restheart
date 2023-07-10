import { Axios } from "./axios"
import { HOST_API, GUEST, GUEST_DON_VI } from '../api'

function getDonVi(query) {
  query = query ? ('?' + query) : ''
  return Axios('get', `${HOST_API}${GUEST}${GUEST_DON_VI}${query}`)
}
export {
  getDonVi,
}
