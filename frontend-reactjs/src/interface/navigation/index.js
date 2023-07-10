import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { Router, Route, Switch } from "react-router-dom";
import { LoadingComponent } from "interface/components";
import { withRouter } from "react-router";
import axios from "axios";
import indexRoutes from "interface/navigation/router";
import { TEMPLATE } from "../../../config";
import * as cmFunction from "common/ulti/commonFunction";
import * as ccFunction from "common/ulti/cookieFunction";
import { AUTHORIZATION_COOKIE, SUPER } from "../../common/ulti/constants";
import {
  fetchLoginSuccess,
  fetchLoginFailure,
} from "../../controller/redux/login-fetch-reducers";
import * as generalServices from "../../controller/services/generalServices";
import * as tbMenu from "../../controller/services/tbMenuServices";
import * as tbCurrentPermission from "../../controller/services/tbCurrentPermissionServices";

import { fetchGeneral } from "../../controller/redux/app-reducer";
import { toast } from "react-toastify";

class NavigationRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      allDone: false,
    };
  }

  componentDidMount() {
    let { LoginRes } = this.props;
    console.log("2.this.props: ", this.props);
    console.log("didMount");

    if (
      cmFunction.isEmpty(LoginRes) &&
      ccFunction.getCookie(AUTHORIZATION_COOKIE)
    ) {
      this.props.dispatch(
        fetchLoginSuccess(
          JSON.parse(
            cmFunction.decode(ccFunction.getCookie(AUTHORIZATION_COOKIE))
          )
        )
      );
    } else {
      this._initGeneralAuth();
      this.state.allDone = true;
      this.forceUpdate();
    }
  }

  componentDidUpdate(prevProps) {
    console.log("didUpdate");
    let { LoginRes, ToastNotify, General } = this.props;
    if (LoginRes !== prevProps.LoginRes) {
      if (!cmFunction.isEmpty(LoginRes) && ccFunction.checkCookie(LoginRes)) {
        this.state.verified = true;
        this._initGeneral();
      } else {
        this.state.verified = false;
        this._initGeneralAuth();
      }
      this.state.allDone = true;
      this.forceUpdate();
    }
    if (
      ToastNotify !== prevProps.ToastNotify &&
      !cmFunction.isEmpty(ToastNotify)
    ) {
      toast[ToastNotify.type](ToastNotify.data);
    }
    if (General !== prevProps.General) {
    }
  }

  _initGeneral = async () => {
    let { LoginRes } = this.props;
    let checkSuper = LoginRes.roles === SUPER.roles;
    let axiosReq = [tbMenu.getAll()];
    if (!checkSuper) axiosReq.push(tbCurrentPermission.getById(LoginRes.roles));
    let axiosRes = await axios
      .all(axiosReq)
      .then(
        axios.spread((...responses) => {
          return responses;
        })
      )
      .catch((errors) => {
        this.props.dispatch(
          fetchToastNotify({
            type: CONSTANTS.ERROR,
            data: "Có lỗi _initGeneral",
          })
        );
      });
    let menu =
      axiosRes[0] && axiosRes[0]._embedded ? axiosRes[0]._embedded : [];
    let currentPermission = checkSuper
      ? LoginRes.roles
      : axiosRes[1]
      ? axiosRes[1]
      : null;

    this.props.dispatch(
      fetchGeneral({ Menu: menu, CurrentPermission: currentPermission })
    );
  };

  _initGeneralAuth = async () => {
    let axiosReq = [generalServices.getMenu()];
    let axiosRes = await axios
      .all(axiosReq)
      .then(
        axios.spread((...responses) => {
          return responses;
        })
      )
      .catch((errors) => {
        this.props.dispatch(
          fetchToastNotify({
            type: CONSTANTS.ERROR,
            data: "Có lỗi _initGeneral",
          })
        );
      });

    let menu =
      axiosRes[0] && axiosRes[0]._embedded ? axiosRes[0]._embedded : [];

    this.props.dispatch(fetchGeneral({ Menu: menu }));
  };
  render() {
    let { verified, allDone } = this.state;

    if (!allDone) {
      return <LoadingComponent />;
    }
    return (
      <Switch>
        {console.log("verified: ", verified)}
        {verified ? (
          <>
            {console.log("3. Admin")}
            <Route
              path={indexRoutes[TEMPLATE].path}
              component={indexRoutes[TEMPLATE].component}
              // {/Admin}
            />
          </>
        ) : (
          <>
            {console.log("3. Auth")}
            <Route
              path={indexRoutes["auth"].path}
              component={indexRoutes["auth"].component}
              // {/Auth}
            />{" "}
          </>
        )}
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  let { LoginRes, ToastNotify, General } = state;
  return { LoginRes, ToastNotify, General };
};

export default compose(withRouter, connect(mapStateToProps))(NavigationRouter);
// export default connect(mapStateToProps)(NavigationRouter);
