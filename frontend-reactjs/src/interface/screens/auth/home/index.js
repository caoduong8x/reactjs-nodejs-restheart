import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as cmFunction from "../../../../common/ulti/commonFunction";
import { __DEV__ } from "../../../../common/ulti/constants";
import * as guestServices from "../../../../controller/services/guestServices";
import queryString from "query-string";
import { InputSearch } from "../../../../interface/components";
import imgBackground from "../../../../common/assets/imgs/photo.jpg";
import { isEmpty } from "../../../../common/ulti/commonFunction";
import * as tbGuest from "../../../../controller/services/guestServices";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DanhSach: [],
    };
  }

  componentDidMount = async () => {
    console.log("componentDidMount");
    let data = await tbGuest.getDVHC();
    data = data && data._embedded ? data._embedded : [];
    this.setState({ DanhSach: data });
    //console.log("DanhSach: ", this.state.DanhSach);
  };
  init = async () => {
    let data = await tbGuest.getDVHC();
    data = data && data._embedded ? data._embedded : [];
    this.setState({ DanhSach: data });
    console.log("DanhSach: ", this.state.DanhSach);
  };

  render() {
    let DanhSach = this.state.DanhSach;
    console.log("render");
    console.log("DanhSach: ", DanhSach);
    return (
      <React.Fragment>
        <div className="main portlet fade-in">
          <div className="portlet-title">
            <div className="caption">
              <i className="fas fa-grip-vertical" />
              Danh sách đơn vị hành chính
            </div>
          </div>
          <div style={{ margin: 25 }}>
            <br />
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing="0"
              ref="dataTable"
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn vị</th>
                  <th>Tên đơn vị</th>
                  <th>
                    Diện tích km<sup>2</sup>
                  </th>
                  <th>Dân số </th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {DanhSach &&
                  DanhSach.length > 0 &&
                  DanhSach.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item.Ma}</td>
                        <td>{item.name}</td>
                        <td>{item.dientich}</td>
                        <td>{item.danso}</td>
                        {/* <td>{item.Ma}</td> */}
                        {/* <td>{item.DonViCha ? item.DonViCha.Ten : ""}</td>
                            <td>{item.SoDienThoai}</td>
                            <td>{item.DiaChi}</td> */}
                        <td>{item.KichHoat ? "Kích hoạt" : " "}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <br />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let { General } = state;
  return { General };
};
export default connect(mapStateToProps)(Home);
