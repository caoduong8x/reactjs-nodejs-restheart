import React, { Component } from "react";
class GoToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGoToTop: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll = () => {
    let show;
    if (window.scrollY >= 20) show = true;
    else show = false;
    if (show !== this.state.showGoToTop) {
      this.setState({ showGoToTop: show });
      console.log(this.state.showGoToTop);
    }
  };
  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);
  };
  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };
  render() {
    {
      if (this.state.showGoToTop) {
        return (
          <button
            className="btn btn-sm btn-primary border-radius"
            style={{ position: "fixed", right: 20, bottom: 20 }}
            onClick={() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
          >
            <i className="fas fa-chevron-circle-up" />
          </button>
        );
      } else return <></>;
    }
  }
}
export default GoToTop;
