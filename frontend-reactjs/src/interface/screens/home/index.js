import { Chart } from "react-google-charts";
import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from 'react-modal';
import Select from 'react-select'
import queryString from 'query-string'
import XLSX from 'xlsx';
import ReactDOM from 'react-dom';
import moment from 'moment'
import { fetchToastNotify } from "../../../controller/redux/app-reducer";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import { Other } from 'interface/screens/error'
import { __DEV__, SUPER } from "../../../common/ulti/constants";
import * as CONSTANTS from 'common/ulti/constants';
import axios from 'axios'
import { BreadCrumbs } from "../../components";
import * as mediaServices from 'controller/services/mediaServices'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {
    this._init()
  }

  _init = async () => {

  }

  handleDownload = async () => {
    await mediaServices.downloadFiles('ChisoBanQLKKT.xlsx')
  }

  render() {
    let { } = this.state
    return (
      <div className="main portlet fade-in">
        <BreadCrumbs title={"Thống kê"} route={[{ label: 'Thống kê', value: '/' }]} />
        <br />
        <div className="row ">
          <button onClick={this.handleDownload}>Download</button>
        </div>
        <div className="row ">

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  let { LoginRes, General } = state;
  return { LoginRes, General };
};
export default connect(mapStateToProps)(Home);

// function Home({ ...props }) {
//   return (

//   );
// }

// export default Home;
