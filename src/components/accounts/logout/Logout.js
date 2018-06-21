import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import AuthenticationService from '../../../services/AuthenticationService';
import { CircularProgress } from 'material-ui';

class Logout extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null,
      serverError: null,
      isLoading: false,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true})
    const token = localStorage.getItem('token');

    if (token !== null) {
      let logoutResponse = AuthenticationService.logout(
        {
          token,
        },
        false,
      );

      logoutResponse
        .then(res => {
          localStorage.clear();
          this.setState({ redirect: true });
          setTimeout(() => {
            clearInterval();
            this.props.history.push('/login');
            window.location.reload();
          }, 2000);
        })
        .catch(err => {
          this.setState({ serverError: true });
        });
    } else {
      this.props.history.push('/login');
      window.location.reload();
    }
  }

  onDialogClose(e) {
    this.setState({ serverError: null });
  }

  render() {
    const { redirect, serverError, isLoading } = this.state;
    return (
      <div>
        {redirect && (
          <ErrorDialog
            title="Sessão Terminada"
            text="Terminou a sessão com sucesso"
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress style={{height:'80px', width:'80px', top:"50%", left:"50%", position: 'absolute'}}/>
        )}
      </div>
    );
  }
}

export default withRouter(Logout);
