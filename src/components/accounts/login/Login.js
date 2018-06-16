import React, { Component } from 'react';
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
      serverError: null
    };
    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitLogin(e) {
    e.preventDefault();
    let errors = AccountsValidations.validateLogin(this.state.email, this.state.password);
    if (errors.length > 0) {
      this.setState({ errors });
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
        localStorage.setItem('username', res.data.userId);
        let expirationDate = new Date().getTime() + 900000
        localStorage.setItem('expirationDate', expirationDate);
        this.props.history.push('/livestock')
      }).catch((err) => {
        this.setState({ serverError: true })
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
    const { errors, serverError } = this.state;
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
      </div>
    );
  }
}

export default withRouter(Login);
