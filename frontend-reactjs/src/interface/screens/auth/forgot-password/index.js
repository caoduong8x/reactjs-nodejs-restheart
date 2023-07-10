import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as tbUsers from "../../../../controller/services/tbUsersServices";
import * as CONSTANTS from 'common/ulti/constants';
import Footer from "../../../navigation/layouts/Admin/Footer/index.jsx";
import { fetchToastNotify } from "../../../../controller/redux/app-reducer";

class ForgotPassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  _handleReset = async () => {
    this.props.dispatch(fetchToastNotify({ type: CONSTANTS.WARNING, data: 'Chức năng không khả dụng, liên hệ quản trị viên' }))
  }

  render() {
    return (
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <div className="container auth">
              <div className="row justify-content-center">
                <div className="col-lg-5">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Khôi phục mật khẩu</h3></div>
                    <div className="card-body">
                      <div className="mb-3 text-muted">Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn.</div>
                      <div className="form-group"><label className="mb-1" htmlFor="inputEmailAddress">Email</label>
                        <input className="form-control py-4" id="inputEmailAddress" type="email" aria-describedby="emailHelp"
                          placeholder="Nhập địa chỉ email" />
                      </div>
                      <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                        <Link to={'/login'}>
                          Đăng nhập
                        </Link>
                        <button  onClick={this._handleReset} className="btn btn-primary">Đặt lại mật khẩu</button>
                      </div>
                    </div>
                    <div className="card-footer text-center">
                      <div className="">
                        <Link to={'/register'}>
                          Chưa có tài khoản? Đăng ký ngay!
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* <div id="layoutAuthentication_footer">
        <Footer />
      </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  let { LoginRes } = state;
  return { LoginRes };
};
export default connect(mapStateToProps)(ForgotPassword);
