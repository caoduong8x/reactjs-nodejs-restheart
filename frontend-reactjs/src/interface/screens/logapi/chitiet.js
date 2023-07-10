import React, { Component } from "react";
import { connect } from "react-redux";
import { Page404, Other } from 'interface/screens/error'
import { BreadCrumbs, FormInput, FormWrapper } from "interface/components";
import { __DEV__ } from "../../../common/ulti/constants";
import * as CONSTANTS from 'common/ulti/constants';
import { confirmAlert } from 'react-confirm-alert';
import AsyncSelect from 'react-select/async';
import * as cmFunction from 'common/ulti/commonFunction'
import * as tbLogApi from 'controller/services/tbLogApiServices'
import * as tbDonVi from 'controller/services/tbDonViServices'
import { fetchToastNotify } from "../../../controller/redux/app-reducer";
import JSONTree from 'react-json-tree'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

class ChiTiet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInsert: this.props.match.params.id == 0,
      error: false,
      form: null
    }
  }

  componentDidMount() {
    this._init()
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props
    if (match.params.id !== prevProps.match.params.id) {
      this._init()
    }
  }

  _init = async () => {
    this.state.isInsert = this.props.match.params.id == 0
    let id = this.props.match.params.id
    if (!this.state.isInsert) {
      let data = await tbLogApi.getById(id)
      if (data) {
        delete data.pwd
        this.state.form = data
      }
      if (!data) this.state.error = true
      this.forceUpdate()
    }
  }

  _handleChangeElement = (evt) => {
    return
  }

  // _handleCheckAccount = async () => {
  //   if (!this.state.form.account) return false;
  //   let filter = { filter: {} };
  //   filter.count = true;
  //   filter.page = 1;
  //   filter.pagesize = 1;
  //   filter.filter['account'] = this.state.form.account;
  //   filter.filter = JSON.stringify(filter.filter)
  //   filter = new URLSearchParams(filter).toString()
  //   let data = await tbLogApi.getAll(filter)
  //   return data._returned;
  // }

  // _handleChangeCheckElement = (evt) => {
  //   this.state.form[evt.target.id] = evt.target.checked
  //   this.forceUpdate()
  // }

  //SELECT
  // _handleLoadOptions = (inputValue, callback) => {
  //   clearTimeout(this.state.searchTimeout);
  //   this.state.searchTimeout = setTimeout(async () => {
  //     let filter = {}
  //     filter.page = 1
  //     filter.pagesize = 1000
  //     filter.count = true
  //     filter.filter = JSON.stringify({ Ten: cmFunction.regexText(inputValue) });
  //     filter = new URLSearchParams(filter).toString()
  //     let dsDonVi = await tbDonVi.getAll(filter)
  //     dsDonVi = (dsDonVi && dsDonVi._embedded ? dsDonVi._embedded : [])
  //     let donvi = cmFunction.convertSelectOptions(dsDonVi, '_id.$oid', 'Ten')
  //     this.state.donvi = donvi
  //     this.forceUpdate()
  //     callback(donvi);
  //   }, 500);
  // };

  // _handleDonViChange = (sel) => {
  //   this.state.donviSelected = sel
  //   this.forceUpdate()
  // }

  //ACTION
  // _handleConfirm = (_type = 0, _action, _stay = false) => {
  //   confirmAlert({
  //     title: `${!_type ? 'Sửa' : (_type < 0 ? 'Xóa' : 'Thêm')} dữ liệu`,
  //     message: `Xác nhận ${!_type ? 'sửa' : (_type < 0 ? 'xóa' : 'thêm')} dữ liệu`,
  //     buttons: [
  //       {
  //         label: 'Không',
  //         onClick: () => { return }
  //       },
  //       {
  //         label: 'Có',
  //         onClick: () => _action(_stay)
  //       }
  //     ]
  //   });
  // }

  // _handleDelete = async () => {
  //   if (this.state.isInsert) return
  //   let { id } = this.props.match.params

  //   let { LoginRes } = this.props
  //   if (LoginRes._id === id) {
  //     this.props.dispatch(fetchToastNotify({ type: CONSTANTS.WARNING, data: "Không thể xóa tài khoản của bạn" }))
  //     return
  //   }

  //   let axiosRes = await tbLogApi.deleteById(id)
  //   if (axiosRes) {
  //     this.props.dispatch(fetchToastNotify({ type: CONSTANTS.SUCCESS, data: "Xóa thành công" }))
  //     cmFunction.goBack()
  //   }
  // }

  // _handleSave = (stay) => {
  //   if (cmFunction.formValidate(this, 'form')) {
  //     this._handleConfirm(this.state.isInsert, this._handleUpdateInfo, stay)
  //   } else {
  //     confirmAlert({
  //       title: 'Dữ liệu không hợp lệ',
  //       message: 'Vui lòng nhập đúng định dạng dữ liệu',
  //       buttons: [
  //         {
  //           label: 'Đồng ý',
  //           onClick: () => { return }
  //         }
  //       ]
  //     });
  //     return;
  //   }
  // }
  // _handleUpdateInfo = async (stay) => {
  //   let { form, isInsert, donviSelected } = this.state
  //   let axiosRes, axiosReq = cmFunction.clone(form)
  //   axiosReq.DonVi = null
  //   if (donviSelected) {
  //     axiosReq.DonVi = cmFunction.clone(donviSelected)
  //     delete axiosReq.DonVi.value
  //     delete axiosReq.DonVi.label
  //   }

  //   if (isInsert) {
  //     axiosRes = await tbLogApi.create(axiosReq)
  //   } else {
  //     let id = this.props.match.params.id;
  //     axiosRes = await tbLogApi.updateById(id, axiosReq)
  //   }
  //   if (axiosRes) {
  //     this.props.dispatch(fetchToastNotify({ type: CONSTANTS.SUCCESS, data: 'Thành công' }))
  //     if (isInsert) {
  //       this.state.form = {}
  //       this.state.donviSelected = null
  //       this.forceUpdate()
  //     }
  //     if (!stay) cmFunction.goBack()
  //   }
  // }

  render() {
    let { isInsert, form, error } = this.state
    let { donvi, donviSelected } = this.state
    if (error)
      return <Page404 />
    if (!form) return <div></div>
    try {
      return (
        <div className="main portlet fade-in">
          <BreadCrumbs title={"Chi tiết"}
            route={[{ label: 'Lịch sử thao tác hệ thống', value: '/quan-tri/log-api' }, { label: 'Thông tin chi tiết', value: '/phan-quyen/nhom-quyen/:id' }]}
          />
          <div className="portlet-title">
            <div className="caption">
              <i className="fas fa-grip-vertical" />Thông tin chi tiết
            </div>
            <div className="action">
              {/* <button onClick={() => this._handleSave(false)} className="btn btn-sm btn-outline-primary border-radius">
                <i className="fas fa-save" />Lưu
                </button>
              <button onClick={() => this._handleSave(true)} className="btn btn-sm btn-outline-primary border-radius">
                <i className="far fa-save" />Lưu và tiếp tục
                </button> */}
              <div className="btn btn-sm dropdown">
                <button className="btn btn-sm btn-outline-primary border-radius dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-share" />Khác
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button onClick={cmFunction.goBack} className="btn btn-sm">
                    <i className="fas fa-reply" />Quay lại
                  </button>
                  <button onClick={this._init} className="btn btn-sm">
                    <i className="fas fa-sync" />Làm mới
                  </button>
                  {/* {!isInsert && <button onClick={() => this._handleConfirm(-1, this._handleDelete)} className="btn btn-sm">
                    <i className="fas fa-trash" />
                    Xóa
                  </button>} */}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex justify-content-between" data-toggle="collapse" data-target="#collapseExample" aria-expanded="true" aria-controls="collapseExample">
              <span className="caption-subject">Thông tin cơ bản</span>
              <span>
                <i className="fas fa-chevron-up" />
                <i className="fas fa-chevron-down" />
              </span>

            </div>
            <div className="collapse show" id="collapseExample">
              <div className="card-body ">
                <div className="form-body" ref="form">
                  <FormWrapper>
                    <FormInput
                      id="time"
                      type="text"
                      required={false}
                      disabled={true}
                      readOnly={true}
                      label="Thời gian"
                      defaultValue={cmFunction.timestamp2DateString(form.request.timestamp.$numberLong, 'DD/MM/YYYY HH:mm:ss') || ''}
                      onChange={this._handleChangeElement} />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      id="account"
                      type="text"
                      required={false}
                      disabled={true}
                      readOnly={true}
                      label="Tài khoản"
                      defaultValue={form.user.account}
                      onChange={this._handleChangeElement} />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      id="attack"
                      type="text"
                      required={false}
                      disabled={true}
                      readOnly={true}
                      label="Hành động"
                      defaultValue={form.request.method}
                      onChange={this._handleChangeElement} />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      id="object"
                      type="text"
                      required={false}
                      disabled={true}
                      readOnly={true}
                      label="Đối tượng"
                      defaultValue={form.request.originalUrl}
                      onChange={this._handleChangeElement} />
                  </FormWrapper>
                  <FormWrapper>
                    <FormInput
                      id="object"
                      type="text"
                      required={false}
                      disabled={true}
                      readOnly={true}
                      label="IP"
                      defaultValue={form.user.ip}
                      onChange={this._handleChangeElement} />
                  </FormWrapper>
                  <hr />
                  Nội dung chi tiết:
                  <FormWrapper>
                    <JSONTree
                      data={form}
                      theme={{
                        extend: theme,
                        // underline keys for literal values
                        valueLabel: {
                          textDecoration: 'underline',
                        },
                        // switch key for objects to uppercase when object is expanded.
                        // `nestedNodeLabel` receives additional argument `expandable`
                        nestedNodeLabel: ({ style }, keyPath, nodeType, expanded) => ({
                          style: {
                            ...style,
                            textTransform: expanded ? 'uppercase' : style.textTransform,
                          },
                        }),
                      }}
                    />
                  </FormWrapper>

                </div>
              </div>
              <div className="card-footer">
              </div>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      if (__DEV__) console.log(e)
      return <Other data={e} />
    }

  }
}

const mapStateToProps = state => {
  let { LoginRes, General } = state;
  return { LoginRes, General };
};
export default connect(mapStateToProps)(ChiTiet);
