import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import { Redirect } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress } from 'material-ui';
import InputForm from '../../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../../App';
import UserPreferencesService from '../../../../../services/UserPreferencesService';

class UserChangeEmailPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      changedEmail: null,
    };
  }

  onCancel = e => {
    const { entityId, id } = this.props.match.params;
    this.props.history.push(`/livestock/users/${entityId}/detail/${id}`);
  };

  onSubmit = async values => {
    this.setState({ isLoading: true });

    let changeEmailResponse = UserPreferencesService.changeEmail(
      values.email,
      localStorage.getItem('userId'),
      true,
    );

    changeEmailResponse
      .then(res => {
        this.setState({ isLoading: false, changedEmail: true });
        localStorage.setItem('username', values.email);
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  };

  validate = (values, i18n) => {
    const errors = {};

    if (!values.email) {
      errors.email = i18n.users.errors.currentEmailisEqual;
    }
    if (values.email && values.email === localStorage.getItem('username')) {
      errors.email = i18n.users.errors.currentEmailisEqual;
    }

    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const { isLoading, serverError, changedEmail } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {changedEmail && (
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
                  initialValues={{ email: localStorage.getItem('username') ? localStorage.getItem('username') : '' }}
                  validate={fields => this.validate(fields, i18n)}
                  render={({ handleSubmit, invalid, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                      <Card style={{ marginTop: 20 }}>
                        <CardContent>
                          <div className="card-header">
                            <Typography variant="headline" className="card-header_title">
                              {i18n.general.changeEmail}
                            </Typography>
                          </div>
                          <div className="card-body">
                            <InputForm
                              label="E-mail"
                              name="email"
                              required={true}
                              type="email"
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

export default UserChangeEmailPage;
