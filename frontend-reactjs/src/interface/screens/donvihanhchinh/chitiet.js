import React, { Component } from "react";
import { connect } from "react-redux";
import { Page404, Other } from "interface/screens/error";
import { BreadCrumbs, FormInput, FormWrapper } from "interface/components";
import { __DEV__ } from "../../../common/ulti/constants";
import * as CONSTANTS from "common/ulti/constants";
import { confirmAlert } from "react-confirm-alert";
import * as cmFunction from "common/ulti/commonFunction";
import * as tbDonViHanhChinh from "controller/services/tbDonViHanhChinhServices";
import * as tbDanhMucUngDung from "controller/services/tbDanhMucUngDungServices";
import { fetchToastNotify } from "../../../controller/redux/app-reducer";

class ChiTiet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInsert: this.props.match.params.id == 0,
      error: false,
      form: {},
      donvi: [],
      donviSelected: null,
      searchTimeout: null,
      check: false,
      itemHuyen: null,
    };
    this._handleSuaClick = this._handleSuaClick.bind(this);
    this._handleHuyClick = this._handleHuyClick.bind(this);
  }

  componentDidMount() {
    this._init();
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props;
    if (match.params.id !== prevProps.match.params.id) {
      this._init();
    }
  }

  _init = async () => {
    let id = this.props.match.params.id;
    this.state.isInsert = id == 0;
    if (!this.state.isInsert) {
      let data = await tbDonViHanhChinh.getById(id);
      if (data) {
        this.state.form = data;
        this.state.donviSelected = cmFunction.convertSelectedOptions(
          data.DonViCha,
          "_id.$oid",
          "Ten"
        );
      }
      if (!data) this.state.error = true;
      this.forceUpdate();
    }
  };
  _handleAddSubData = () => {
    if (this.state.form.huyen && this.state.form.huyen.length > 0) {
      this.state.form.huyen = [...this.state.form.huyen, { Ma: "", name: "" }];
    } else {
      this.state.form.huyen = [{ Ma: "", name: "" }];
    }
    this.setState({
      ...this.state,
      itemHuyen: null,
    });
    this.forceUpdate();
  };
  _handleChangeElement = (evt) => {
    this.state.form[evt.target.id] = evt.target.value;
    this.forceUpdate();
  };
  _handleChangeSubMaElement = (evt, index) => {
    // this.state.maHuyen = evt.target.value;
    this.state.form.huyen[index].Ma = evt.target.value;
    this.forceUpdate();
  };
  _handleChangeSubTenElement = (evt, index) => {
    this.state.form.huyen[index].name = evt.target.value;
    this.forceUpdate();
  };

  _handleChangeCheckElement = (evt) => {
    this.state.form[evt.target.id] = evt.target.checked;
    this.forceUpdate();
  };

  //SELECT LOAD DATA
  _handleLoadOptions = (inputValue, callback) => {
    clearTimeout(this.state.searchTimeout);
    this.state.searchTimeout = setTimeout(async () => {
      let filter = {};
      filter.page = 1;
      filter.pagesize = 1000;
      filter.count = true;
      filter.sort_by = "STT";
      filter.filter = JSON.stringify({
        Ten: cmFunction.regexText(inputValue),
        KichHoat: true,
      });
      filter = new URLSearchParams(filter).toString();
      let dsDonVi = await tbDonViHanhChinh.getAll(filter);
      dsDonVi = dsDonVi && dsDonVi._embedded ? dsDonVi._embedded : [];
      let id = this.props.match.params.id;
      let find = dsDonVi.find((ele) => ele._id.$oid == id);
      find = find ? [find] : [];
      let donvi = cmFunction.convertSelectOptions(
        dsDonVi,
        "_id.$oid",
        "Ten",
        find
      );
      this.state.donvi = donvi;
      this.forceUpdate();
      callback(donvi);
    }, 500);
  };

  _handleCheckMaDV = async () => {
    if (!this.state.form.Ma) return false;
    let filter = { filter: {} };
    filter.count = true;
    filter.page = 1;
    filter.pagesize = 1;
    filter.filter["Ma"] = this.state.form.Ma;
    filter.filter = JSON.stringify(filter.filter);
    filter = new URLSearchParams(filter).toString();
    let data = await tbDonViHanhChinh.getAll(filter);
    return data._returned;
  };

  _handleDonViChange = (sel) => {
    this.state.donviSelected = sel;
    this.forceUpdate();
  };

  //ACTION
  _handleConfirm = (_type = 0, _action, _stay = false) => {
    confirmAlert({
      title: `${!_type ? "Sửa" : _type < 0 ? "Xóa" : "Thêm"} dữ liệu`,
      message: `Xác nhận ${
        !_type ? "sửa" : _type < 0 ? "xóa" : "thêm"
      } dữ liệu`,
      buttons: [
        {
          label: "Không",
          onClick: () => {
            return;
          },
        },
        {
          label: "Có",
          onClick: () => _action(_stay),
        },
      ],
    });
  };

  _handleDelete = async () => {
    if (this.state.isInsert) return;
    let { id } = this.props.match.params;
    let axiosRes = await tbDonViHanhChinh.deleteById(id);
    if (axiosRes) {
      this.props.dispatch(
        fetchToastNotify({ type: CONSTANTS.SUCCESS, data: "Xóa thành công" })
      );
      cmFunction.goBack();
    }
  };

  _handleSave = (stay) => {
    if (cmFunction.formValidate(this, "form")) {
      this._handleConfirm(this.state.isInsert, this._handleUpdateInfo, stay);
    } else {
      confirmAlert({
        title: "Dữ liệu không hợp lệ",
        message: "Vui lòng nhập đúng định dạng dữ liệu",
        buttons: [
          {
            label: "Đồng ý",
            onClick: () => {
              return;
            },
          },
        ],
      });
      return;
    }
  };

  _handleUpdateInfo = async (stay) => {
    let { form, donviSelected, isInsert } = this.state;
    let axiosReq = form;

    axiosReq.STT = Number(axiosReq.STT || 9999);
    axiosReq.DonViCha = null;
    axiosReq.Cap = 0;
    if (donviSelected) {
      let dvTmp = cmFunction.clone(donviSelected);
      delete dvTmp.DonViCha;
      axiosReq.DonViCha = dvTmp;
      axiosReq.Cap = dvTmp.Cap + 1;
      delete axiosReq.DonViCha.value;
      delete axiosReq.DonViCha.label;
    }
    if (axiosReq.huyen && axiosReq.huyen.length > 0) {
      axiosReq.huyen = axiosReq.huyen.filter((item) => item.Ma !== "");
    }
    let axiosRes;
    if (isInsert) {
      axiosRes = await tbDonViHanhChinh.create(axiosReq);
    } else {
      let id = this.props.match.params.id;
      axiosRes = await tbDonViHanhChinh.updateById(id, axiosReq);
    }
    if (axiosRes) {
      this.props.dispatch(
        fetchToastNotify({ type: CONSTANTS.SUCCESS, data: "Thành công" })
      );
      if (isInsert) {
        this.state.form = {};
        this.state.donviSelected = null;
        this.forceUpdate();
      }
      if (!stay) cmFunction.goBack();
    }
  };
  _handleLuuClick = (item) => {
    this.setState({ ...this.state, itemHuyen: "" });
    this.forceUpdate();
  };
  _handleSuaClick = (item) => {
    this.setState({
      ...this.state,
      itemHuyen: item.Ma,
    });
    this.forceUpdate();
  };
  _handleHuyClick = (index) => {
    if (
      this.state.form.huyen[index].Ma === "" &&
      this.state.form.huyen[index].name === ""
    )
      this.state.form.huyen.splice(index, 1);
    this.setState({ ...this.state, itemHuyen: null });
    this.forceUpdate();
  };
  _handleConfirmDelete = (index) => {
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
          onClick: () => this._handleDeleteSubOne(index),
        },
      ],
    });
  };
  _handleDeleteSubOne = (index) => {
    this.state.form.huyen.splice(index, 1);
    this._handleUpdateInfo(true);
  };
  render() {
    let { isInsert, itemHuyen, form, error, donviSelected } = this.state;

    if (error) return <Page404 />;
    try {
      return (
        <div className="main portlet">
          <BreadCrumbs
            title={"Chi tiết"}
            route={[
              {
                label: "Quản lý đơn vị hành chính",
                value: "/quan-ly/don-vi-hanh-chinh",
              },
              {
                label: "Thông tin đơn vị hành chính",
                value: "/quan-ly/don-vi-hanh-chinh/:id",
              },
            ]}
          />
          <div className="portlet-title">
            <div className="caption">
              <i className="fas fa-grip-vertical" />
              Thông tin đơn vị hành chính
            </div>
            <div className="action">
              <button
                onClick={() => this._handleSave(false)}
                className="btn btn-sm btn-outline-primary border-radius"
              >
                <i className="fas fa-save" />
                Lưu
              </button>
              <button
                onClick={() => this._handleSave(true)}
                className="btn btn-sm btn-outline-primary border-radius"
              >
                <i className="far fa-save" />
                Lưu và tiếp tục
              </button>
              <div className="btn btn-sm dropdown">
                <button
                  className="btn btn-sm btn-outline-primary border-radius dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-share" />
                  Khác
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button onClick={cmFunction.goBack} className="btn btn-sm">
                    <i className="fas fa-reply" />
                    Quay lại
                  </button>
                  <button onClick={this._init} className="btn btn-sm">
                    <i className="fas fa-sync" />
                    Làm mới
                  </button>
                  {!isInsert && (
                    <button
                      onClick={() =>
                        this._handleConfirm(-1, this._handleDelete)
                      }
                      className="btn btn-sm"
                    >
                      <i className="fas fa-trash" />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div
              className="card-header d-flex justify-content-between"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="true"
              aria-controls="collapseExample"
            >
              <span className="caption-subject">Thông tin cơ bản</span>
              <span>
                <i className="fas fa-chevron-up" />
                <i className="fas fa-chevron-down" />
              </span>
            </div>

            <div className="collapse show" id="collapseExample">
              <div className="card-body">
                <div className="form-body" ref="form">
                  <FormWrapper>
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={true}
                      disabled={false}
                      readOnly={false}
                      onChange={this._handleChangeElement}
                      defaultValue={form.name || ""}
                      type="text"
                      id="name"
                      label="Tên đơn vị"
                      placeholder="Nhập tên đơn vị"
                    />
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={true}
                      disabled={false}
                      readOnly={false}
                      onChange={this._handleChangeElement}
                      defaultValue={form.Ma || ""}
                      type="text"
                      id="Ma"
                      label="Mã đơn vị"
                      // _handleCheck={this._handleCheckMaDV}
                    />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={true}
                      disabled={false}
                      readOnly={false}
                      pattern=""
                      onChange={this._handleChangeElement}
                      defaultValue={form.dientich || ""}
                      type="number"
                      id="dientich"
                      label="Diện tích"
                      placeholder="Nhập diện tích"
                    />
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={true}
                      disabled={false}
                      readOnly={false}
                      pattern=""
                      onChange={this._handleChangeElement}
                      defaultValue={form.danso || ""}
                      type="number"
                      id="danso"
                      label="Dân số"
                      placeholder="Nhập dân số"
                    />
                  </FormWrapper>
                  {/* <FormWrapper>
                    <FormInput
                      loadOptions={this._handleLoadOptions}
                      onChange={this._handleDonViChange}
                      required={false}
                      defaultValue={donviSelected}
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      defaultOptions={true}
                      type="select"
                      label="Trực thuộc"
                      placeholder="Chọn đơn vị trực thuộc ..."
                    />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      required={false}
                      disabled={false}
                      readOnly={false}
                      onChange={this._handleChangeElement}
                      defaultValue={form.DiaChi || ""}
                      type="text"
                      id="DiaChi"
                      label="Địa chỉ"
                      placeholder="Nhập địa chỉ"
                    />
                  </FormWrapper> */}
                  {/*<FormWrapper>
                    <FormInput
                      onChange={this._handleChangeElement}
                      defaultValue={form.DiaChiBanDo}
                      type="gmapaddress"
                      id="DiaChiBanDo"
                      label="Địa chỉ bản đồ"
                      placeholder="Nhập địa chỉ bản đồ"
                    />
                  </FormWrapper>*/}
                  {/* <div className="form-group form-row form-custom form-no-spacing">
                    <label className="col-md-3 mb-0">Địa chỉ bản đồ</label>
                    <GmapAddress className='form-control' onChange={this._handleChangeElement} value={form.DiaChiBanDo} id="DiaChiBanDo" placeholder="Địa chỉ bản đồ" />
                  </div> */}
                  {/* <FormWrapper>
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={false}
                      disabled={false}
                      readOnly={false}
                      pattern={CONSTANTS.VN_PHONE_NUMBER}
                      onChange={this._handleChangeElement}
                      defaultValue={form.SoDienThoai || ""}
                      type="text"
                      id="SoDienThoai"
                      label="SĐT liên hệ"
                      errorLabel="SĐT không hợp lệ"
                      placeholder="Nhập SĐT liên hệ"
                    />
                    <FormInput
                      parentClass="col-md-6"
                      labelClass="col-md-6"
                      inputClass="col-md-6"
                      required={false}
                      disabled={false}
                      readOnly={false}
                      pattern=""
                      onChange={this._handleChangeElement}
                      defaultValue={form.STT || ""}
                      type="number"
                      id="STT"
                      label="STT"
                      placeholder="Nhập số thứ tự"
                    />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      type="textarea"
                      onChange={this._handleChangeElement}
                      rows="3"
                      defaultValue={form.GhiChu || ""}
                      id="GhiChu"
                      label="Ghi chú"
                    />
                  </FormWrapper> */}
                  <FormWrapper>
                    <FormInput
                      type="checkbox"
                      onChange={this._handleChangeCheckElement}
                      defaultValue={form.KichHoat}
                      id="KichHoat"
                      label="Kích hoạt"
                    />
                  </FormWrapper>
                </div>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
          <div className="card">
            <div
              className="card-header d-flex justify-content-between"
              data-toggle="collapse"
              data-target="#collapseExample2"
              aria-expanded="true"
              aria-controls="collapseExample2"
            >
              <span className="caption-subject">
                Danh sách các Thành Phố / Huyện
              </span>
              <span>
                <i className="fas fa-chevron-up" />
                <i className="fas fa-chevron-down" />
              </span>
            </div>

            <div className="collapse show" id="collapseExample2">
              <div className="card-body">
                <div className="form-body" ref="form">
                  <FormInput
                    parentClass="col-md-16"
                    labelClass="col-md-16"
                    inputClass="col-md-16"
                    required={false}
                    disabled={false}
                    readOnly={false}
                    onChange={this._handleChangeElement}
                    defaultValue={JSON.stringify(form.huyen) || ""}
                    type="textarea"
                    rows="3"
                    id="name"
                    label="Schema:"
                  />
                  <br />
                  <button
                    className="btn btn-sm btn-outline-primary border-radius"
                    onClick={() => this._handleAddSubData()}
                  >
                    <i className="fa fa-plus" />
                    Thêm trường dữ liệu
                  </button>
                  <br />
                  <br />
                </div>
              </div>

              <div className="card-footer"></div>
            </div>

            {form.huyen &&
              form.huyen.length > 0 &&
              form.huyen.map((item, index) => {
                return (
                  <div
                    className="collapse show"
                    id="collapseExample"
                    key={index}
                  >
                    <div className="card-body">
                      <div
                        className="form-body"
                        ref="form"
                        style={{
                          border: "solid 1px Aquamarine",
                        }}
                      >
                        <br />

                        <FormWrapper>
                          <FormInput
                            parentClass="col-md-6"
                            labelClass="col-md-6"
                            inputClass="col-md-6"
                            required={true}
                            disabled={itemHuyen !== item.Ma}
                            readOnly={false}
                            onChange={(evt) => {
                              this._handleChangeSubMaElement(evt, index);
                              this.setState({
                                ...this.state,
                                itemHuyen: item.Ma,
                              });
                            }}
                            defaultValue={this.state.form.huyen[index].Ma || ""}
                            type="text"
                            id="Ma"
                            label="Mã Thành Phố / Huyện"
                            placeholder="Mã Thành Phố / Huyện"
                          />
                          <FormInput
                            parentClass="col-md-6"
                            labelClass="col-md-6"
                            inputClass="col-md-6"
                            required={true}
                            disabled={itemHuyen !== item.Ma}
                            readOnly={false}
                            onChange={(evt) => {
                              this._handleChangeSubTenElement(evt, index);
                              this.setState({
                                ...this.state,
                                itemHuyen: item.Ma,
                              });
                            }}
                            defaultValue={
                              this.state.form.huyen[index].name || ""
                            }
                            type="text"
                            id="name"
                            label="Tên Thành Phố / Huyện"
                            placeholder="Tên Thành Phố / Huyện"
                            // _handleCheck={this._handleCheckMaDV}
                          />
                        </FormWrapper>

                        {(itemHuyen !== item.Ma && (
                          <button
                            className="btn btn-sm btn-outline-primary border-radius"
                            onClick={() => {
                              this._handleSuaClick(item);
                            }}
                          >
                            <i className="fa fa-edit" />
                            Sửa
                          </button>
                        )) || (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary border-radius"
                              onClick={() => {
                                this._handleSave(true);
                                this._handleLuuClick();
                              }}
                            >
                              <i className="fa fa-save" />
                              Lưu
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary border-radius"
                              onClick={() => {
                                this._handleHuyClick(index);
                              }}
                            >
                              <i className="fa fa-ban" />
                              Hủy
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => this._handleConfirmDelete(index)}
                          className="btn btn-sm btn-outline-danger border-radius"
                        >
                          <i className="fas fa-trash" />
                          Xóa
                        </button>
                        <br />
                      </div>
                    </div>
                    <br />

                    <div className="card-footer"></div>
                  </div>
                );
              })}
          </div>
        </div>
      );
    } catch (e) {
      if (__DEV__) console.log(e);
      return <Other data={e} />;
    }
  }
}

const mapStateToProps = (state) => {
  let { LoginRes, General } = state;
  return { LoginRes, General };
};
export default connect(mapStateToProps)(ChiTiet);
