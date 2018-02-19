import React, { Component } from "react";
import Loading from "./Loading";
import { connect } from "react-redux";
import { compose } from "redux";
import { onRequest } from './fetch'
import { withRouter } from "react-router-dom";

const withRequestFlow = ({ onRequest, flag="", component }) => { 
  return WrappedComponent => {
    class ApiFlowWrapper extends React.Component {

      constructor(props){
        super(props)
        this.state = {
          isLoading: true,
          dataLoaded: false
        }
      }

      componentDidMount(){
        const { dataLoaded } = this.state

        // detects back button pressing, dont fetch on back button
        if (!!dataLoaded) {
          return;
        }

        onRequest().then(this.onSuccess);
      }


      componentWillReceiveProps(nextProps) {
        const { history, location } = this.props;
        // detects refresh by navigating to same route
        if (
          history.action === "PUSH" &&
          nextProps.location.key !== location.key &&
          location.pathname === nextProps.location.pathname
        ) {
          this.setState({isLoading: true, dataLoaded: false})
          onRequest().then(this.onSuccess)
        }
      }

      onSuccess  = (result) => {
        let state = {};
        state[flag] = result
        state.dataLoaded = true
        state.isLoading = false
        this.setState(state);
      }

      render() {
        if (this.state.isLoading) {
          return component;
        }

        return <WrappedComponent {...this.props} {...this.state} />;
      }
    }
    return withRouter(ApiFlowWrapper);
  };
};

const enhance = compose(
  connect(({ app }) => {
    const { invoices } = app;
    return {
      invoices
    };
  }),
  withRequestFlow({
    component: <Loading />,
    flag: "invoices",
    onRequest
  })
);

class Invoices extends Component {
  static defaultProps = {
    invoices: []
  };
  render() {
    return this.props.invoices.map((invoice, i) => {
      return <h2 key={i}>{invoice.name}</h2>;
    });
  }
}

export default enhance(Invoices);
