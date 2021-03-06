import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
var authToken = require('../providers/authToken');

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      console.log(authToken.getToken());
      if(authToken.getToken() === null)
        this.setState({ loading: false, redirect: true });
      else
        this.setState({ loading: false });
      // fetch('localhost:10010/api/checkToken',{
      //   headers: {
      //   'Authorization': authToken.getToken(),
      // },
      // })
      //   .then(res => {
      //     if (res.status === 200) {
      //       this.setState({ loading: false });
      //     } else {
      //       const error = new Error(res.error);
      //       throw error;
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err);
      //     this.setState({ loading: false, redirect: true });
      //   });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        // TODO guardar user y pass?
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}