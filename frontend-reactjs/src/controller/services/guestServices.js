import { Axios } from "./axios";
import { HOST_API, GUEST, GUEST_DON_VI, GUEST_DON_VI_HANH_CHINH } from "../api";

function getDonVi(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${GUEST}${GUEST_DON_VI}${query}`);
}
function getDVHC(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${GUEST}${GUEST_DON_VI_HANH_CHINH}${query}`);
}
export { getDonVi, getDVHC };
