import React, { Component, Fragment } from 'react';
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from 'material-ui';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import InputForm from '../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import WorkerService from '../../../../services/WorkerService';
import FixedValuesService from '../../../../services/FixedValuesService';
import i18n from '../task/i18n';
import { I18nContext } from '../../../App';

class CreateOrUpdateUserPage extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      countries: null,
      isLoading: null,
      isCreate: null,
      serverError: null,
      addUser: false,
      userEntity: null,
      search: null,
      user: null,
      emailSearch: null,
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({ isLoading: true });

    const countryPromise = FixedValuesService.getCountries();

    countryPromise
      .then(res => {
        this.setState({ countries: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });

    if (id) {
      const workerPromise = WorkerService.getWorker(id, true);

      workerPromise
        .then(res => {
          this.setState({ isCreate: false, userEntity: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      this.setState({ isCreate: true, isLoading: false });
    }
  }

  onSubmitSearchEmail = async values => {
    this.setState({ isLoading: true, emailSearch: values.email });
    const userEmailSearchPromise = WorkerService.findByEmail(values.email, true);

    userEmailSearchPromise
      .then(res => {
        this.setState({ user: res.data.id ? res.data : null, isLoading: false, search: true });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  };

  onSubmitUserEntity = async values => {
    const { entityId } = this.props.match.params;
    values.agricolaEntity = entityId;
    values.lang = localStorage.getItem('language');
    if (values.id) {
      let updateWorkerResponse = WorkerService.update(values, true);
      updateWorkerResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.replace(`/livestock/users/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createWorkerResponse = WorkerService.create(values, true);

      createWorkerResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/users/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  //TODO
  validateSearchEmail = (values, i18n) => {
    const errors = {};
    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCancel = e => {
    const { entityId, id } = this.props.match.params;
    if (id) this.props.history.push(`/livestock/users/${entityId}/detail/${id}`);
    else this.props.history.push(`/livestock/users/${entityId}`);
  };

  onCallUserForm = e => {
    this.setState({ search: null, addUser: true, isCreate: false });
  };

  render() {
    const {
      isLoading,
      serverError,
      isCreate,
      addUser,
      user,
      userEntity,
      search,
      countries,
      emailSearch,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <I18nContext.Consumer>
            {({ i18n }) => (
              <Fragment>
                {isCreate && (
                  <Form
                    onSubmit={this.onSubmitSearchEmail}
                    mutators={{
                      ...arrayMutators,
                    }}
                    initialValues={{}}
                    validate={fields => this.validateSearchEmail(fields, i18n)}
                    render={({ handleSubmit, pristine, invalid, values }) => (
                      <form onSubmit={handleSubmit}>
                        <Card style={{ marginTop: 20 }}>
                          <CardContent>
                            <Typography variant="headline" className="card-header_title">
                              {i18n.users.searchUser}
                            </Typography>
                            <div>
                              <InputForm
                                name="email"
                                required={true}
                                type="email"
                                label={i18n.users.email}
                                style={{ width: '80%', margin: '10px', marginBottom: '40px' }}
                              />

                              <Button
                                size="medium"
                                variant="raised"
                                color="primary"
                                className="card-button"
                                type="submit"
                                disabled={pristine || invalid}
                              >
                                {i18n.general.search}
                              </Button>
                            </div>
                            {user && (
                              <div className="card-container">
                                <div className="card-info">
                                  <Typography variant="title" style={{ marginTop: '20px' }}>
                                    {user.username}
                                  </Typography>
                                  <p>{user.email}</p>
                                </div>
                                <div className="card-actions">
                                  <Button
                                    size="medium"
                                    variant="raised"
                                    color="primary"
                                    className="card-button"
                                    onClick={this.onCallUserForm}
                                  >
                                    {i18n.users.addUser}
                                  </Button>
                                </div>
                              </div>
                            )}
                            {!user &&
                              search && (
                                <div className="card-container">
                                  <div className="card-info">
                                    <Typography variant="title">{i18n.users.newUser}</Typography>
                                  </div>
                                  <div className="card-actions">
                                    <Button
                                      size="medium"
                                      variant="raised"
                                      color="primary"
                                      className="card-button"
                                      onClick={this.onCallUserForm}
                                    >
                                      {i18n.users.addUser}
                                    </Button>
                                  </div>
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      </form>
                    )}
                  />
                )}
                {(addUser || !isCreate) && (
                  <Form
                    onSubmit={this.onSubmitUserEntity}
                    mutators={{
                      ...arrayMutators,
                    }}
                    initialValues={{
                      ...userEntity,
                      email: emailSearch ? emailSearch : userEntity.email,
                    }}
                    validate={this.validateUserEntity}
                    render={({ handleSubmit, pristine, invalid, values }) => (
                      <form onSubmit={handleSubmit}>
                        <Card style={{ marginTop: 20 }}>
                          <CardContent>
                            <Typography variant="headline" className="card-header_title">
                              {i18n.users.worker}
                            </Typography>
                            <div>
                              <InputForm name="id" type="hidden" />
                              <InputForm
                                name="name"
                                required={true}
                                type="text"
                                label={i18n.users.name}
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                name="email"
                                required={true}
                                type="email"
                                label="E-mail"
                                disabled={!isCreate}
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                name="function"
                                required={true}
                                type="text"
                                label={i18n.users.role}
                                style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                name="phone"
                                required={true}
                                type="text"
                                label={i18n.users.phone}
                                style={{ width: '28%', margin: '10px', marginBottom: '40px' }}
                              />
                              {countries && (
                                <Field
                                  name="country"
                                  render={({ input, meta }) => (
                                    <FormControl
                                      style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                                      error={meta.touched && meta.error ? true : false}
                                    >
                                      <InputLabel required>{i18n.users.country}</InputLabel>
                                      <Select {...input}>
                                        {countries.map(value => {
                                          return (
                                            <MenuItem key={value.name} value={value.name}>
                                              {value.name}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                      {meta.touched &&
                                        meta.error && (
                                          <FormHelperText id="name-error-text">
                                            {meta.error}
                                          </FormHelperText>
                                        )}
                                    </FormControl>
                                  )}
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
                                disabled={pristine || invalid}
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
        )}
        {serverError && (
          <ErrorDialog
            title={i18n.general.serverErrorTitle}
            text={i18n.general.serverErrorMessage}
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'fixed' }}
          />
        )}
      </Fragment>
    );
  }
}

export default CreateOrUpdateUserPage;
