import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import { Redirect } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress } from 'material-ui';
import SelectForm from '../../../../UI/Inputs/SelectForm';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../../App';
import UserPreferencesService from '../../../../../services/UserPreferencesService';
import FixedValuesService from '../../../../../services/FixedValuesService';

class UserChangeLanguagePage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      changedLanguage: null,
      languages: null,
    };
  }

  onCancel = e => {
    const { entityId, id } = this.props.match.params;
    this.props.history.push(`/livestock/users/${entityId}/detail/${id}`);
  };

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

    if (!values.language) {
      errors.language = i18n.users.errors.languageRequired;
    }

    return errors;
  };

  componentWillMount() {
    //Get languages List
    this.setState({ isLoading: true });
    let languagesPromise = FixedValuesService.getLanguages();
    languagesPromise
      .then(res => {
        this.setState({ languages: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  }

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onSubmit = async (values, changeLanguage) => {
    this.setState({ isLoading: true });

    let changeLanguageResponse = UserPreferencesService.changeLang(
      values.language,
      localStorage.getItem('userId'),
      true,
    );

    changeLanguageResponse
      .then(res => {
        changeLanguage(values.language);
        this.setState({ isLoading: false, changedLanguage: true });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  };

  render() {
    const { isLoading, serverError, changedLanguage, languages } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n, changeLanguage }) => (
          <Fragment>
            {changedLanguage && (
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
                  onSubmit={fields => this.onSubmit(fields, changeLanguage)}
                  initialValues={{
                    language: languages
                      ? languages.find(lang => lang.code === localStorage.getItem('language')).code
                      : '',
                  }}
                  validate={fields => this.validate(fields, i18n)}
                  render={({ handleSubmit, invalid, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                      <Card style={{ marginTop: 20 }}>
                        <CardContent>
                          <div className="card-header">
                            <Typography variant="headline" className="card-header_title">
                              {i18n.general.changeLanguage}
                            </Typography>
                          </div>
                          <div className="card-body">
                            {languages && (
                              <SelectForm
                                label={i18n.general.changeLanguage}
                                name="language"
                                required={true}
                                list={languages}
                                isLanguage={true}
                                style={{
                                  width: '45%',
                                  margin: '10px',
                                  marginBottom: '40px',
                                }}
                              />
                            )}
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

export default UserChangeLanguagePage;
