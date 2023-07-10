import { Axios } from "./axios";
import { HOST_API, GENERAL } from "../api";

// let HOST_API = "http://127.0.0.1:3000";
// let GENERAL = "/api/general";
function getMenu(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${GENERAL}${"/menu"}${query}`);
}

function getNhomQuyen(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${GENERAL}${"/nhom-quyen"}${query}`);
}

function getDanhMucUngDung(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${GENERAL}${"/danh-muc-ung-dung"}${query}`);
}

export { getMenu, getNhomQuyen, getDanhMucUngDung };
