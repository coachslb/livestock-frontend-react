import React, { Component } from 'react';
import { Typography } from 'material-ui';
import { Redirect } from 'react-router-dom';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import AccountsValidations from '../../../validations/AccountsValidations';
import ForgotPasswordService from '../../../services/ForgotPasswordService';
import SuccessCard from '../../UI/Cards/SuccessCard';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import queryString from 'query-string';

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
      repeatPassword: '',
      errors: null,
      serverError: null,
      successRequest: null,
      redirect: null,
      isLoading: null,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitChangePassword(e) {
    this.setState({isLoading: true})
    let errors = AccountsValidations.validateChangePassword(this.state.password, this.state.repeatPassword, this.props.i18n);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      const parsed = queryString.parse(this.props.location.search);
      let changePasswordResponse = ForgotPasswordService.forgotPasswordConfirm(parsed.token, this.state.password, parsed.lang, true); 

      changePasswordResponse.then((res)=>{
        this.setState({successRequest: true});
        setTimeout(() => { clearInterval(); this.setState({redirect: true, isLoading: false}); }, 2000);
        //setTimeout mostra mensagem de sucesso e redirect to login
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: false })
      });
      
    }

    e.preventDefault();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  render() {
    const { errors, serverError, successRequest, redirect, isLoading } = this.state;
    const { i18n } = this.props;
    return (
      <div className="forgotPasswordForm">
        <Typography variant="headline" className="form-title">
          {i18n.changePassword.changePasswordTitle}
        </Typography>
        <p>{i18n.changePassword.changePasswordHelper}</p>
        <form onSubmit={this.onSubmitChangePassword.bind(this)}>
          <InputField
            style={{ width: '90%' }}
            name="password"
            type="password"
            onChange={this.onChange.bind(this)}
            required={true}
            label={i18n.changePassword.newPassword}
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'password';
              })
            }
          />
          <InputField
            style={{ width: '90%' }}
            name="repeatPassword"
            type="password"
            onChange={this.onChange.bind(this)}
            required={true}
            label={i18n.changePassword.repeatPassword}
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'repeatPassword';
              })
            }
          />
          { !successRequest &&
          <SubmitButton
            style={{ marginTop: '50px', width: '20%' }}
            color="primary"
            variant="raised"
          >
            {i18n.changePassword.confirm}
          </SubmitButton>
          }
        </form>
        { successRequest &&
        <SuccessCard 
            elevation={2}
            style={{marginTop: '20px', width: '90%', backgroundColor: '#39b5ab', padding:'10px'}} 
            title={i18n.changePassword.sendSuccess}
            titleVariant="headline" 
            titleComponent="h3"
            text={i18n.changePassword.sendMessage}
            textComponent="p"
            textVariant="subheading"/>
        }
        {errors && (
          <ErrorDialog
            title={i18n.general.inputErrorTitle}
            text={i18n.changePassword.invalidPassword}
            errors={errors}
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title={i18n.general.serverErrorTitle}
            text={i18n.general.serverErrorMessage}
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress/>
        )}
        { redirect && (
            <Redirect to="/login"/>
        )
        }
      </div>
    );
  }
}

export default withRouter(ChangePassword);
