import React, { Component } from 'react';
import { Typography } from 'material-ui';
import { Redirect } from 'react-router-dom';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import AccountsValidations from '../../../validations/AccountsValidations';
import ForgotPasswordService from '../../../services/ForgotPasswordService';
import SuccessCard from '../../UI/Cards/SuccessCard';
import { CircularProgress } from 'material-ui';
import { errorHandler } from '../../utils/ErrorHandler';

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      errors: null,
      serverError: null,
      serverErrorTitle: null,
      serverErrorMessage: null,
      successRequest: null,
      redirect: null,
      isLoading: null,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onSubmitForgotPassword(e) {
    this.setState({isLoading: true})
    let errors = AccountsValidations.validateForgotPassword(this.state.email, this.props.i18n);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      const { email } = this.state;

      let forgotPasswordResponse = ForgotPasswordService.forgotPassword({
        email,
        lang: this.props.language
      }, false);

      forgotPasswordResponse.then((res)=>{
        this.setState({successRequest: true});
        setTimeout(() => { clearInterval(); this.setState({redirect: true, isLoading: false}); }, 2000);
        //setTimeout mostra mensagem de sucesso e redirect to login
      }).catch((err) => {
        if(err.code === 400){
          const serverErrorTitle = err.data.title;
          const serverErrorMessage = err.data.message;
          const errors = errorHandler(err.data.invalidParams);
          this.setState({ isLoading: false, errors, serverErrorTitle, serverErrorMessage });
        }else{
          this.setState({ serverError: true, isLoading: false });
        }
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
    this.setState({ errors: null, serverError: null, serverErrorTitle: null, serverErrorMessage: null });
  }

  render() {
    const { errors, serverError, successRequest, redirect, isLoading, serverErrorMessage, serverErrorTitle } = this.state;
    const { i18n } = this.props;
    return (
      <div className="forgotPasswordForm">
        <Typography variant="headline" className="form-title">
          {i18n.forgotPassword.recoverPassword}
        </Typography>
        <form onSubmit={this.onSubmitForgotPassword.bind(this)}>
          <InputField
            style={{ width: '90%' }}
            name="email"
            type="email"
            onChange={this.handleEmailChange.bind(this)}
            required={true}
            label="E-mail"
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
            {i18n.forgotPassword.send}
          </SubmitButton>
          }
        </form>
        { successRequest &&
        <SuccessCard 
            elevation={2}
            style={{marginTop: '20px', width: '90%', backgroundColor: '#39b5ab', padding:'10px'}} 
            title={i18n.forgotPassword.sendSuccess}
            titleVariant="headline" 
            titleComponent="h3"
            text={i18n.forgotPassword.sendMessage}
            textComponent="p"
            textVariant="subheading"/>
        }
        {errors && (
          <ErrorDialog
            title={serverErrorTitle || i18n.general.inputErrorTitle}
            text={serverErrorMessage || i18n.forgotPassword.invalidEmail}
            errors={errors}
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title={serverErrorTitle || i18n.general.serverErrorTitle}
            text={serverErrorTitle || i18n.general.serverErrorMessage}
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
