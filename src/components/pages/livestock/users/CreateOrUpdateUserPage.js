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
    values.lang = 'pt-PT' //TODO
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
  validateSearchEmail = values => {
    const errors = {};
    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCancel = e => {
    const { entityId, id } = this.props.match.params;
    if(id)
      this.props.history.push(`/livestock/users/${entityId}/detail/${id}`);
    else
      this.props.history.push(`/livestock/users/${entityId}`);
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
          <Fragment>
            {isCreate && (
              <Form
                onSubmit={this.onSubmitSearchEmail}
                mutators={{
                  ...arrayMutators,
                }}
                initialValues={{}}
                validate={this.validateSearchEmail}
                render={({ handleSubmit, pristine, invalid, values }) => (
                  <form onSubmit={handleSubmit}>
                    <Card style={{ marginTop: 20 }}>
                      <CardContent>
                        <Typography variant="headline" className="card-header_title">
                          Pesquisa utilizador
                        </Typography>
                        <div>
                          <InputForm
                            name="email"
                            required={true}
                            type="email"
                            label="Email do utilizador"
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
                            Pesquisar
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
                                Adicionar Utilizador
                              </Button>
                            </div>
                          </div>
                        )}
                        {!user &&
                          search && (
                            <div className="card-container">
                              <div className="card-info">
                                <Typography variant="title">
                                  Novo Utilizador
                                </Typography>
                              </div>
                              <div className="card-actions">
                                <Button
                                  size="medium"
                                  variant="raised"
                                  color="primary"
                                  className="card-button"
                                  onClick={this.onCallUserForm}
                                >
                                  Adicionar Utilizador
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
                initialValues={{ ...userEntity, email: emailSearch ? emailSearch : userEntity.email }}
                validate={this.validateUserEntity}
                render={({ handleSubmit, pristine, invalid, values }) => (
                  <form onSubmit={handleSubmit}>
                    <Card style={{ marginTop: 20 }}>
                      <CardContent>
                        <Typography variant="headline" className="card-header_title">
                          Trabalhador
                        </Typography>
                        <div>
                          <InputForm name="id" type="hidden" />
                          <InputForm
                            name="username"
                            required={true}
                            type="text"
                            label="Nome"
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                          />
                          <InputForm
                            name="email"
                            required={true}
                            type="email"
                            label="Email"
                            disabled={!isCreate}
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                          />
                          <InputForm
                            name="function"
                            required={true}
                            type="text"
                            label="Função"
                            style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                          />
                          <InputForm
                            name="phone"
                            required={true}
                            type="text"
                            label="Contacto"
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
                                  <InputLabel required>País</InputLabel>
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
                            Cancelar
                          </Button>
                          <Button
                            size="medium"
                            variant="raised"
                            color="primary"
                            className="card-button"
                            type="submit"
                            disabled={pristine || invalid}
                          >
                            Guardar
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
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
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
