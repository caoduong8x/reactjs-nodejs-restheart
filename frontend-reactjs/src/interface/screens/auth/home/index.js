import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as cmFunction from "../../../../common/ulti/commonFunction";
import { __DEV__ } from "../../../../common/ulti/constants";
import * as guestServices from "../../../../controller/services/guestServices";
import queryString from "query-string";
import { InputSearch } from "../../../../interface/components";
import imgBackground from '../../../../common/assets/imgs/photo.jpg'
 import { isEmpty } from "../../../../common/ulti/commonFunction";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount = async () => {

  };

  render() {
    let { } = this.state;
    return (
      <React.Fragment>
        <div className="main portlet"  >
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
