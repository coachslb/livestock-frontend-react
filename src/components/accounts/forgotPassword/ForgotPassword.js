import React, { Component } from 'react';
import { Typography } from 'material-ui';
import { Redirect } from 'react-router-dom';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import AccountsValidations from '../../../validations/AccountsValidations';
import ForgotPasswordService from '../../../services/ForgotPasswordService';
import SuccessCard from '../../UI/Cards/SuccessCard';
import { CircularProgress } from '@material-ui/core';

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      errors: null,
      serverError: null,
      successRequest: null,
      redirect: null,
      isLoading: null,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitForgotPassword(e) {
    this.setState({isLoading: true})
    let errors = AccountsValidations.validateForgotPassword(this.state.email);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      const { email } = this.state;

      let forgotPasswordResponse = ForgotPasswordService.forgotPassword({
        email,
        //todo language prop from page
        lang: 'pt-PT'
      }, false);

      forgotPasswordResponse.then((res)=>{
        this.setState({successRequest: true});
        setTimeout(() => { clearInterval(); this.setState({redirect: true, isLoading: false}); }, 3000);
        //setTimeout mostra mensagem de sucesso e redirect to login
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: true })
      });
      
    }

    e.preventDefault();
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    });
    e.preventDefault();
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  render() {
    const { errors, serverError, successRequest, redirect, isLoading } = this.state;

    return (
      <div className="forgotPasswordForm">
        <Typography variant="headline" className="form-title">
          Repor palavra-passe
        </Typography>
        <form onSubmit={this.onSubmitForgotPassword.bind(this)}>
          <InputField
            style={{ width: '90%' }}
            name="email"
            type="email"
            onChange={this.handleEmailChange.bind(this)}
            required={true}
            label="Email"
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'email';
              })
            }
          />
          { !successRequest &&
          <SubmitButton
            style={{ marginTop: '50px', width: '20%' }}
            color="primary"
            variant="raised"
          >
            Enviar
          </SubmitButton>
          }
        </form>
        { successRequest &&
        <SuccessCard 
            elevation={2}
            style={{marginTop: '20px', width: '90%', backgroundColor: '#39b5ab', padding:'10px'}} 
            title="Success"
            titleVariant="headline" 
            titleComponent="h3"
            text="We send you an email for you to recover your password!!!"
            textComponent="p"
            textVariant="subheading"/>
        }
        {errors && (
          <ErrorDialog
            title="Input Errors"
            text="The email is invalid"
            errors={errors}
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
