import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Router } from "react-router-dom";
import { BrowserRouter as BRouter } from "react-router-dom";
import NavigationRouter from "interface/navigation/";
import Modal from "react-modal";
// REDUX
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import rootReducer from "controller/redux/rootReducer.js";
import rootEpic from "controller/redux/rootEpic.js";
import { axiosConfig } from "./common/ulti/axiosConfig";
// common
import "common/assets/scss/index.scss";
import "common/assets/js/index";
import { APP_NAME } from "../config";
// services

const epicMiddleware = createEpicMiddleware(rootEpic);
const initialState = {
  //global variable
};
let store = createStore(
  rootReducer,

  initialState,

  applyMiddleware(epicMiddleware)
);
//let store2 = createStore(rootReducer);

const history = createHashHistory();

axiosConfig(store);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = APP_NAME;
  }

  render() {
    Modal.setAppElement("#root");
    return (
      <Provider store={store}>
        <BRouter>
          <>
            {console.log("1.store.getState(): ", store.getState())}
            <NavigationRouter />
          </>
        </BRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
