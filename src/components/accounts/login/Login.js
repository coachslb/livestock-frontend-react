import React, { Component } from 'react';
import { CircularProgress } from 'material-ui';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import AuthenticationService from '../../../services/AuthenticationService';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import {withRouter} from 'react-router-dom';
import AccountsValidations from '../../../validations/AccountsValidations';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: null,
      serverError: null,
      isLoading: false
    };
    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitLogin(e) {
    e.preventDefault();
    this.setState({isLoading: true})
    let errors = AccountsValidations.validateLogin(this.state.email, this.state.password);
    if (errors.length > 0) {
      this.setState({ errors, isLoading: false });
    } else {
      const { email, password } = this.state;

      let loginResponse = AuthenticationService.login(
        {
          username: email,
          password,
          language: 'pt-PT',
        },
        false,
      );

      loginResponse.then((res)=>{
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('deviceToken', res.data.deviceToken);
        localStorage.setItem('language', res.data.language.code);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        let expirationDate = new Date().getTime() + 900000
        localStorage.setItem('expirationDate', expirationDate);
        this.setState({ isLoading: false })
        if(!res.data.entityId){
          this.props.history.push('/create-entity');
        }
        else{
          localStorage.setItem('entityId', res.data.entityId);
          localStorage.setItem('workerId', res.data.workerId);
          this.props.history.push('/');
        }
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: false })
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  render() {
    const { errors, serverError, isLoading } = this.state;
    return (
      <div className="loginForm">
        <form onSubmit={this.onSubmitLogin.bind(this)}>
          <InputField
            style={{ width: '90%' }}
            name="email"
            onChange={this.onChange}
            required={true}
            label="E-mail"
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'email';
              })
            }
          />
          <InputField
            style={{ marginTop: '20px', width: '90%' }}
            name="password"
            type="password"
            onChange={this.onChange}
            required={true}
            label="Password"
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'password';
              })
            }
          />
          <SubmitButton
            variant="raised"
            style={{ marginTop: '50px', width: '40%' }}
            color="primary"
          >
            Entrar
            <i className="material-icons">arrow_forward</i>
          </SubmitButton>
        </form>
        {errors && (
          <ErrorDialog
            title="Login Error"
            text="There are some input errors"
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

export default withRouter(Login);
