import React, { Component } from 'react';
import { CircularProgress } from 'material-ui';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import AuthenticationService from '../../../services/AuthenticationService';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import { withRouter } from 'react-router-dom';
import AccountsValidations from '../../../validations/AccountsValidations';
import { errorHandler } from '../../utils/ErrorHandler';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: null,
      serverError: null,
      serverErrorTitle: null,
      serverErrorMessage: null,
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitLogin(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    let errors = AccountsValidations.validateLogin(this.state.email, this.state.password, this.props.i18n);
    if (errors.length > 0) {
      this.setState({ errors, isLoading: false });
    } else {
      const { email, password } = this.state;

      let loginResponse = AuthenticationService.login(
        {
          username: email,
          password,
          language: this.props.language,
        },
        false,
      );

      loginResponse
        .then(res => {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('deviceToken', res.data.deviceToken);
          localStorage.setItem('language', res.data.language.code);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('username', res.data.username);
          let expirationDate = new Date().getTime() + 900000;
          localStorage.setItem('expirationDate', expirationDate);
          this.setState({ isLoading: false });
          if (!res.data.entityId) {
            this.props.history.push('/create-entity');
          } else {
            localStorage.setItem('entityId', res.data.entityId);
            localStorage.setItem('workerId', res.data.workerId);
            this.props.history.push('/');
          }
        })
        .catch(err => {
          if(err.code === 400){
            const serverErrorTitle = err.data.title;
            const serverErrorMessage = err.data.message;
            const errors = errorHandler(err.data.invalidParams);
            this.setState({ serverError: true, isLoading: false, errors, serverErrorTitle, serverErrorMessage });
          }else{
            this.setState({ serverError: true, isLoading: false });
          }
          
        });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null, serverErrorMessage: null, serverErrorTitle: null });
  }

  render() {
    const { errors, serverError, isLoading, serverErrorTitle, serverErrorMessage } = this.state;
    const { i18n } = this.props;

    console.log(errors)
    return (
      <div className="loginForm">
        <form onSubmit={this.onSubmitLogin.bind(this)}>
          <InputField
            style={{ width: '90%' }}
            name="email"
            onChange={this.onChange}
            required={true}
            label={i18n.login.username}
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
            label={i18n.login.password}
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
            {i18n.login.submit}
            <i className="material-icons">arrow_forward</i>
          </SubmitButton>
        </form>
        {errors && (
          <ErrorDialog
            title={i18n.login.errorTitle}
            text={i18n.login.errorMessage}
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title={serverErrorTitle  || i18n.general.serverErrorTitle}
            text={serverErrorMessage || i18n.general.serverErrorMessage}
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Login);
