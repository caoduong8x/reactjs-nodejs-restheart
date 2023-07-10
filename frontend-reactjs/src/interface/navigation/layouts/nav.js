import React from "react";
//loadable
import loadable from "react-loadable";
import { LoadingComponent } from "interface/components";

const CaNhan = loadable({
  loader: () => import("interface/screens/canhan/thongtin"),
  loading: LoadingComponent,
});
const MatKhau = loadable({
  loader: () => import("interface/screens/canhan/matkhau"),
  loading: LoadingComponent,
});

const DanhSachDonVi = loadable({
  loader: () => import("interface/screens/donvi/danhsach"),
  loading: LoadingComponent,
});
const ChiTietDonVi = loadable({
  loader: () => import("interface/screens/donvi/chitiet"),
  loading: LoadingComponent,
});

const DanhSachNhomQuyen = loadable({
  loader: () => import("interface/screens/nhomquyen/danhsach"),
  loading: LoadingComponent,
});
const ChiTietNhomQuyen = loadable({
  loader: () => import("interface/screens/nhomquyen/chitiet"),
  loading: LoadingComponent,
});

const DanhSachNguoiDung = loadable({
  loader: () => import("interface/screens/nguoidung/danhsach"),
  loading: LoadingComponent,
});
const ChiTietNguoiDung = loadable({
  loader: () => import("interface/screens/nguoidung/chitiet"),
  loading: LoadingComponent,
});
const DanhSachDonViHanhChinh = loadable({
  loader: () => import("interface/screens/donvihanhchinh/danhsach"),
  loading: LoadingComponent,
});
const ChiTietDonViHanhChinh = loadable({
  loader: () => import("interface/screens/donvihanhchinh/chitiet"),
  loading: LoadingComponent,
});

const DanhSachMenu = loadable({
  loader: () => import("interface/screens/menu/danhsach"),
  loading: LoadingComponent,
});
const ChiTietMenu = loadable({
  loader: () => import("interface/screens/menu/chitiet"),
  loading: LoadingComponent,
});

const PhanQuyen = loadable({
  loader: () => import("interface/screens/phanquyen"),
  loading: LoadingComponent,
});

const DanhSachLogApi = loadable({
  loader: () => import("interface/screens/logapi/danhsach"),
  loading: LoadingComponent,
});
const ChiTietLogApi = loadable({
  loader: () => import("interface/screens/logapi/chitiet"),
  loading: LoadingComponent,
});

const DanhSachDanhMuc = loadable({
  loader: () => import("interface/screens/danhmucungdung/danhsach"),
  loading: LoadingComponent,
});
const ChiTietDanhMuc = loadable({
  loader: () => import("interface/screens/danhmucungdung/chitiet"),
  loading: LoadingComponent,
});

const HomePage = loadable({
  loader: () => import("interface/screens/home"),
  loading: LoadingComponent,
});
const Page401 = loadable({
  loader: () => import("interface/screens/error/401"),
  loading: LoadingComponent,
});
const Page404 = loadable({
  loader: () => import("interface/screens/error/404"),
  loading: LoadingComponent,
});
const Page500 = loadable({
  loader: () => import("interface/screens/error/500"),
  loading: LoadingComponent,
});

const dashboardRoutes = [
  {
    path: "/ca-nhan",
    component: CaNhan,
    roles: [],
  },
  {
    path: "/mat-khau",
    component: MatKhau,
    roles: [],
  },
  {
    path: "/home",
    component: HomePage,
    roles: [],
  },
  {
    path: "/401",
    component: Page401,
    roles: [],
  },
  {
    path: "/404",
    component: Page404,
    roles: [],
  },
  {
    path: "/500",
    component: Page500,
    roles: [],
  },
  {
    path: "/quan-ly/don-vi/:id",
    component: ChiTietDonVi,
    roles: [],
  },
  {
    path: "/quan-ly/don-vi",
    component: DanhSachDonVi,
    roles: [],
  },
  {
    path: "/quan-ly/nguoi-dung/:id",
    component: ChiTietNguoiDung,
    roles: [],
  },
  {
    path: "/quan-ly/nguoi-dung",
    component: DanhSachNguoiDung,
    roles: [],
  },
  {
    path: "/quan-ly/don-vi-hanh-chinh/:id",
    component: ChiTietDonViHanhChinh,
    roles: [],
  },
  {
    path: "/quan-ly/don-vi-hanh-chinh",
    component: DanhSachDonViHanhChinh,
    roles: [],
  },
  {
    path: "/quan-tri/menu/:id",
    component: ChiTietMenu,
    roles: [],
  },
  {
    path: "/quan-tri/menu",
    component: DanhSachMenu,
    roles: [],
  },
  {
    path: "/quan-tri/danh-muc-ung-dung/:id",
    component: ChiTietDanhMuc,
    roles: [],
  },
  {
    path: "/quan-tri/danh-muc-ung-dung",
    component: DanhSachDanhMuc,
    roles: [],
  },
  {
    path: "/quan-tri/log-api/:id",
    component: ChiTietLogApi,
    roles: [],
  },
  {
    path: "/quan-tri/log-api",
    component: DanhSachLogApi,
    roles: [],
  },
  {
    path: "/phan-quyen/nhom-quyen/:id",
    component: ChiTietNhomQuyen,
    roles: [],
  },
  {
    path: "/phan-quyen/nhom-quyen",
    component: DanhSachNhomQuyen,
    roles: [],
  },
  {
    path: "/phan-quyen/phan-quyen",
    component: PhanQuyen,
    roles: [],
  },

  { redirect: true, path: "*", to: "/home" },
];

export default dashboardRoutes;
