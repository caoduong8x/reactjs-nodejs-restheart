import React from "react";

import { fetchToastNotify } from "../../../controller/redux/app-reducer";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { Other } from "interface/screens/error";
import { __DEV__ } from "../../../common/ulti/constants";
import * as CONSTANTS from "common/ulti/constants";
// import * as tbDonVi from "controller/services/tbDonViServices";
import * as tbDonViHanhChinh from "controller/services/tbDonViHanhChinhServices";
import * as cmFunction from "common/ulti/commonFunction";
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchToggle: false,
      danhsach: [],
      form: {},

      cbCheckAll: false,
      searchIsOpen: false,
      search: {},
      page: CONSTANTS.DEFAULT_PAGE,
      pagesize: CONSTANTS.DEFAULT_PAGESIZE,
      _size: 0,
      _total_pages: 0,
      filter: null,
    };
  }
  componentDidMount = async () => {
    this._getDanhSachDonViHanhChinh(this._createFilter());
    this._getSearch();
  };

  componentDidUpdate(prevProps) {
    let { location } = this.props;
    if (location !== prevProps.location) {
      this._getDanhSachDonViHanhChinh(this._createFilter());
    }
  }
  componentWillUnmount = () => {
    if (!window.location.href.includes("don-vi-hanh-chinh")) {
      // alert('Xóa Storage khi chuyển khỏi hồ sơ mới');
      // window.localStorage.removeItem("searchDetails")
      window.sessionStorage.removeItem("searchDetails");
    }
  };
  _handleCheckAll = (evt) => {
    this.state.danhsach.forEach((item, index) => {
      item.checked = evt.target.checked;
    });
    this.state.cbCheckAll = evt.target.checked;
    this.forceUpdate();
  };

  _handleCheckItem = (evt) => {
    this.state.danhsach.forEach((item, index) => {
      if (item._id.$oid === evt.target.id || item._id === evt.target.id)
        item.checked = evt.target.checked;
    });
    this.forceUpdate();
  };
  _handleConfirmDelete = (multi, id) => {
    confirmAlert({
      title: "Xóa dữ liệu",
      message: "Bạn muốn xóa dữ liệu",
      buttons: [
        {
          label: "Không",
          onClick: () => {
            return;
          },
        },
        {
          label: "Có",
          onClick: () =>
            multi ? this._handleDeleteMulti() : this._handleDeleteOne(id),
        },
      ],
    });
  };
  _handleDeleteMulti = async () => {
    let { danhsach } = this.state,
      axiosReq = [],
      count = 0;
    danhsach.forEach((item, index) => {
      if (item.checked)
        axiosReq.push(tbDonViHanhChinh.deleteById(item._id.$oid || item._id));
    });

    if (!axiosReq.length) return;

    let axiosRes = await axios
      .all(axiosReq)
      .then(
        axios.spread((...responses) => {
          return responses;
        })
      )
      .catch((errors) => {
        if (__DEV__) console.log(errors);
        this.props.dispatch(
          fetchToastNotify({ type: CONSTANTS.ERROR, data: "Có lỗi" })
        );
      });

    axiosRes.forEach((item, index) => {
      if (item) count++;
    });

    this.props.dispatch(
      fetchToastNotify({
        type: CONSTANTS.SUCCESS,
        data: "Xóa thành công " + count + " dữ liệu",
      })
    );
    this._getDanhSachDonVi(this._createFilter());
  };
  _handleDeleteOne = async (id) => {
    let axiosRes = await tbDonViHanhChinh.deleteById(id);
    if (axiosRes) {
      this.props.dispatch(
        fetchToastNotify({ type: CONSTANTS.SUCCESS, data: "Xóa thành công" })
      );
      this._getDanhSachDonViHanhChinh(this._createFilter());
    }
  };
  _getDanhSachDonViHanhChinh = async (query) => {
    let data = await tbDonViHanhChinh.getAll(query);
    this.state.danhsach = data && data._embedded ? data._embedded : [];
    this.state._size = data._size || 0;
    this.state._total_pages = data._total_pages || 0;
    this.state.cbCheckAll = false;
    this.forceUpdate();
  };
  _createFilter = () => {
    let parsed = queryString.parse(this.props.location.search);
    console.log("this.props.location.search: ", this.props.location.search);
    let { page, pagesize, filter } = parsed;
    filter = filter ? cmFunction.decode(filter) : filter;
    parsed.page = parseInt(page) || CONSTANTS.DEFAULT_PAGE;
    parsed.pagesize = parseInt(pagesize) || CONSTANTS.DEFAULT_PAGESIZE;
    parsed.count = true;
    parsed.sort_by = "STT";
    !filter ? delete parsed.filter : (parsed.filter = filter);
    this.state.page = parseInt(page) || CONSTANTS.DEFAULT_PAGE;
    this.state.pagesize = parseInt(pagesize) || CONSTANTS.DEFAULT_PAGESIZE;
    this.state.filter = filter;
    this.forceUpdate();
    const a = new URLSearchParams(parsed).toString();
    console.log("f _createFilter return: ", a);
    return a;
    // return new URLSearchParams(parsed).toString();
  };
  _createFilterSearch = () => {
    let { search } = this.state;
    let parsed = queryString.parse(this.props.location.search);
    let { page, pagesize } = parsed;
    let filter = {};
    // if (search.Ten) filter['NguoiDung.name'] = cmFunction.regexText(search.Ten.trim())
    // if (donviSelected) filter = { "DonVi.Ma": donviSelected.Ma };
    if (search.name)
      filter["$or"] = [
        { name: cmFunction.regexText(search.name.trim()) },
        { Ma: cmFunction.regexText(search.name.trim()) },
      ];

    parsed.page = parseInt(page) || CONSTANTS.DEFAULT_PAGE;
    parsed.pagesize = parseInt(pagesize) || CONSTANTS.DEFAULT_PAGESIZE;
    parsed.count = true;
    parsed.filter = JSON.stringify(filter);
    // parsed.keys = JSON.stringify({ pwd: 0 });

    this.state.page = parseInt(page) || CONSTANTS.DEFAULT_PAGE;
    this.state.pagesize = parseInt(pagesize) || CONSTANTS.DEFAULT_PAGESIZE;
    this.forceUpdate();
    console.log("parsed: ", parsed);
    const a = new URLSearchParams(parsed).toString();
    console.log("_createFilterSearch: ", a);
    this._updateStorage();
    return a;
  };
  render() {
    let { danhsach, cbCheckAll } = this.state;
    let { page, pagesize, _size, _total_pages, searchToggle, search } =
      this.state;
    return (
      <table
        className="table table-bordered"
        id="dataTable"
        width="100%"
        cellSpacing="0"
        ref="dataTable">
        <thead>
          <tr>
            <th className="td-checkbox">
              <input
                type="checkbox"
                id="cbCheckAll"
                checked={cbCheckAll}
                onChange={this._handleCheckAll}
              />
            </th>
            <th>STT</th>
            <th>Mã đơn vị</th>
            <th>Tên đơn vị</th>
            <th>
              Diện tích km<sup>2</sup>
            </th>
            <th>Dân số </th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {danhsach.map((item, index) => {
            return (
              <tr key={index}>
                <td className="td-checkbox">
                  <input
                    type="checkbox"
                    checked={item.checked || false}
                    id={item._id.$oid || item._id}
                    onChange={this._handleCheckItem}
                  />
                </td>
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
                <td>
                  <Link
                    to={
                      "/quan-ly/don-vi-hanh-chinh/" + item._id.$oid || item._id
                    }
                    title="Chi tiết"
                    className="btn btn-sm btn-outline-info border-radius">
                    <i className="fas fa-pencil-alt" />
                  </Link>
                  <button
                    onClick={() =>
                      this._handleConfirmDelete(
                        false,
                        item._id.$oid || item._id
                      )
                    }
                    title="Xóa"
                    className="btn btn-sm btn-outline-danger border-radius">
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
const mapStateToProps = (state) => {
  let { LoginRes, General } = state;
  return { LoginRes, General };
};

export default connect(mapStateToProps)(ComponentToPrint);
