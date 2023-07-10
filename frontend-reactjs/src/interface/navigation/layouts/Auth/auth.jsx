import React from "react";
//loadable
import loadable from "react-loadable";
import { LoadingComponent } from "interface/components";

const Home = loadable({
  loader: () => import("interface/screens/auth/home"),
  loading: LoadingComponent,
});
const ForgotPassword = loadable({
  loader: () => import("interface/screens/auth/forgot-password"),
  loading: LoadingComponent,
});
const Login = loadable({
  loader: () => import("interface/screens/auth/login"),
  loading: LoadingComponent,
});
const Register = loadable({
  loader: () => import("interface/screens/auth/register"),
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

const authRoutes = [
  {
    path: "/home",
    sidebarName: "Home",
    component: Home,
  },
  {
    path: "/login",
    sidebarName: "Login",
    component: Login,
  },
  {
    path: "/register",
    sidebarName: "Register",
    component: Register,
  },
  {
    path: "/forgot-password",
    sidebarName: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/401",
    sidebarName: "401",
    component: Page401,
  },
  {
    path: "/404",
    sidebarName: "404",
    component: Page404,
  },
  {
    path: "/500",
    sidebarName: "500",
    component: Page500,
  },
  { redirect: true, path: "*", to: "/home" },
];

export default authRoutes;
