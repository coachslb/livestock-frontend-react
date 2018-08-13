import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import { Redirect } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress } from 'material-ui';
import InputForm from '../../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../../App';
import UserPreferencesService from '../../../../../services/UserPreferencesService';

class UserChangePasswordPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      changedPassword: null,
    };
  }

  onCancel = (e) => {
    const { entityId, id } = this.props.match.params;
    this.props.history.push(`/livestock/users/${entityId}/detail/${id}`);
  }
  
  onSubmit = async values => {
    this.setState({ isLoading: true });

    let changePasswordResponse = UserPreferencesService.changePassword(
      values.currentPassword,
      values.newPassword,
      localStorage.getItem('userId'),
      true,
    );

    changePasswordResponse
      .then(res => {
        this.setState({ isLoading: false, changedPassword: true });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  };

  validate = (values, i18n) => {
    const errors = {};
    
    if (!values.currentPassword) {
      errors.currentPassword = i18n.users.errors.currentPasswordRequired;
    }

    if (!values.newPassword) {
      errors.newPassword = i18n.users.errors.newPasswordRequired;
    }

    if (!values.repeatNewPassword) {
      errors.repeatNewPassword = i18n.users.errors.newPasswordRequired;
    }

    if (
      values.newPassword &&
      values.currentPassword &&
      values.currentPassword === values.newPassword
    ) {
      errors.currentPassword = i18n.users.errors.oldPasswordEqualToNewPassword;
      errors.newPassword = i18n.users.errors.oldPasswordEqualToNewPassword;
    }

    if (
      values.newPassword &&
      values.repeatNewPassword &&
      values.newPassword !== values.repeatNewPassword
    ) {
      errors.newPassword = i18n.users.errors.passwordsDidNotMatch;
      errors.repeatNewPassword = i18n.users.errors.passwordsDidNotMatch;
    } 

    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const { isLoading, serverError, changedPassword } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {changedPassword && (
              <Redirect to={`/livestock/users/${localStorage.getItem('entityId')}/detail/${localStorage.getItem('workerId')}`} />
            )}
            {isLoading && (
              <CircularProgress
                style={{
                  height: '80px',
                  width: '80px',
                  top: '50%',
                  left: '50%',
                  position: 'fixed',
                }}
              />
            )}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {!isLoading &&
              !serverError && (
                <Form
                  onSubmit={this.onSubmit}
                  initialValues={{ currentPassword: null }}
                  validate={fields => this.validate(fields, i18n)}
                  render={({ handleSubmit, invalid, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                      <Card style={{ marginTop: 20 }}>
                        <CardContent>
                          <div className="card-header">
                            <Typography variant="headline" className="card-header_title">
                              {i18n.general.changePassword}
                            </Typography>
                          </div>
                          <div className="card-body">
                            <InputForm
                              label={i18n.users.currentPassword}
                              name="currentPassword"
                              required={true}
                              type="password"
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                            <InputForm
                              name="newPassword"
                              required={true}
                              type="password"
                              label={i18n.users.newPassword}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                            <InputForm
                              name="repeatNewPassword"
                              required={true}
                              type="password"
                              label={i18n.users.repeatNewPassword}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              onClick={this.onCancel}
                            >
                              {i18n.users.button.cancel}
                            </Button>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              type="submit"
                              disabled={invalid || pristine}
                            >
                              {i18n.users.button.save}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </form>
                  )}
                />
              )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default UserChangePasswordPage;
