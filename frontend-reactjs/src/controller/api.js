// define root api
import { HTTP_API } from "../../config";
export const HOST_API = HTTP_API;

export const REGISTER_GET_TOKEN = "/register/get_token";
export const REGISTER_VERIFY_TOKEN = "/register/verify_token";
export const REGISTER_CHECK_ACCOUNT = "/api/users/register/check-account";
export const REGISTER_CREATE = "/api/users/register/create";

//AUTH vs REGISTER vs USERS
export const AUTH_SIGNIN = "/api/auth/signin";
export const AUTH_OUT = "/api/auth/signout";
export const AUTH_REFRESH_TOKEN = "/api/auth/refresh-token";
export const CHANGE_PROFILE = "/api/users/change-profile";
export const USER_UPDATE = "/api/users/update";

//DATA
export const DATA = "/api/data";
export const GENERAL = "/api/general";
export const MEDIA_UPLOAD = "/api/media/upload";
export const MEDIA_DOWNLOAD = "/api/media/download";
export const MEDIA_FILE = "/api/media/file";
export const MEDIA_VIDEO = "/api/media/video";

// TABLE
export const TB_MENU = "/tbMenu";
export const TB_DANH_SACH_DEMO = "/tbDanhSachDemo";
export const TB_USERS = "/tbUsers";
export const TB_DON_VI_HANH_CHINH = "/tbDonViHanhChinh";
export const TB_DON_VI = "/tbDonVi";
export const TB_DANH_MUC_UNG_DUNG = "/tbDanhMucUngDung";
export const TB_LOG_API = "/tbLogApi";
export const TB_CURRENT_PERMISSION = "/tbCurrentPermission";
//QUAN TRI
export const TB_NHOM_QUYEN = "/tbNhomQuyen";
export const TB_NHOM_QUYEN_NGUOI_DUNG = "/tbNhomQuyenNguoiDung";

// DASHBOARD
export const AGGRS = "/api/aggrs";
export const AGGRS_DON_VI = "/don-vi";
export const AGGRS_DON_VI_HANH_CHINH = "/don-vi-hanh-chinh";

// GUEST
export const GUEST = "/api/guest";
export const GUEST_DON_VI = "/don-vi";
export const GUEST_DON_VI_HANH_CHINH = "/don-vi-hanh-chinh";

// GSP
export const GSP = "/api/gsp";

// GMAP
export const GMAP = "/api/gmap";
