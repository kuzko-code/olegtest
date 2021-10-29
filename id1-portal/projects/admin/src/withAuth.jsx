import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
//services
import { getUserByToken } from "./services/user-api-services.js"
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
toast.configure();

const mapStateToProps = (state) => {
  return {
    reducerLogo: state.reducerLogo,
    language: state.Intl.locale
  };
};

export default function withAuth(ComponentToProtect, hasAccess) {
  return connect(mapStateToProps)(class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
        access: true
      };
    }

    componentDidMount() {
      getUserByToken(localStorage.getItem('token'))
        .then(res => {
          if (res.error_message === null) {
            this.setState({access:hasAccess, loading: false})
          } else {
            this.setState({ redirect: true, loading: false })
          }
        })
    }

    toast(text) {
      toast.success(text);
    }
    render() {
      const { loading, redirect, access } = this.state;
      if (access === false) {
        return <Redirect to="/403" />;
      }
      if (redirect) {
        return <Redirect to={`/${this.props.language}/login`} />;
      }
      
      var content = !loading ? <ComponentToProtect toast={this.toast}  {...this.props} /> : null;
      return <React.Fragment>
        {content}
      </React.Fragment>;
    }
  })
}