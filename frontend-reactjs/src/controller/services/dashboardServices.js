import { Axios } from "./axios";
import { HOST_API, AGGRS, AGGRS_DON_VI_HANH_CHINH } from "../api";

function getDVHC(query) {
  query = query ? "?" + query : "";
  return Axios("get", `${HOST_API}${AGGRS}${AGGRS_DON_VI_HANH_CHINH}${query}`);
}

export { getDVHC };
