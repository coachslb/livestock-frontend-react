import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from 'material-ui';
import SelectForm from '../../../UI/Inputs/SelectForm';
import InputForm from '../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementSanitaryService from '../../../../services/ManagementSanitaryService';
import FixedValuesService from '../../../../services/FixedValuesService';
import AnimalService from '../../../../services/AnimalService';

class CreateorUpdateSanitaryManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      exploration: '',
      explorationList: null,
      animalList: null,
      eventTypeList: null,
      sanitaries: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId, id } = this.props.match.params;

    let explorationsPromise = ExplorationService.get(null, entityId, true);
    const eventTypePromise = FixedValuesService.getSanitaryEventTypes(true);

    if (id) {
      this.setState({ id });
      const getSanitaryResponse = ManagementSanitaryService.get(id, entityId, true);

      getSanitaryResponse
        .then(res => {
          this.setState({ sanitaries: res.data, exploration: res.data.exploration });
          const getAnimalResponse = AnimalService.get(null, res.data.exploration, true);

          getAnimalResponse
            .then(res => {
              this.setState({ animalList: res.data, isLoading: false });
            })
            .catch(err => {
              this.setState({ isLoading: false, serverError: true });
            });
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    eventTypePromise
      .then(res => {
        this.setState({ eventTypeList: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data, isLoading: false });
    });
  }

  handleExplorationChange = async (values, e) => {
    values.exploration = e.target.value;
    this.setState({ exploration: e.target.value, isLoading: true });

    //get animals
    if (values.animalData) values.animalData = undefined;

    const getAnimalResponse = AnimalService.get(null, e.target.value, true);

    getAnimalResponse
      .then(res => {
        this.setState({ animalList: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  };

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    this.setState({ isLoading: true });
    values.managementType = 10;
    values.agricolaEntity = entityId;
    values.exploration = this.state.exploration;

    if (values.id) {
      let updateSanitaryResponse = ManagementSanitaryService.update(values, true);

      updateSanitaryResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createSanitaryResponse = ManagementSanitaryService.create(values, true);

      createSanitaryResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  validateArray = fields => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.animal) errors.animal = 'Required';
        }else {
          errors.animal = 'Required';
        }
      });
    }
    return errors;
  };

  validate = values => {
    const errors = {};
    if (!values.date) {
      errors.date = 'Required';
    }
    if (new Date(values.date) > new Date()) {
      errors.date = 'Data inválida';
    }

    if (!this.state.exploration) {
      errors.exploration = 'Required';
    }

    if (!values.eventType) {
      errors.eventType = 'Required';
    }

    if (!values.animalData || !values.animalData.length > 0) {
      errors.data = 'Required';
    }

    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCancel = e => {
    const { entityId } = this.props.match.params;
    this.props.history.push(`/livestock/management/${entityId}`);
  };

  render() {
    const { entityId } = this.props.match.params;
    const {
      isLoading,
      serverError,
      exploration,
      explorationList,
      sanitaries,
      animalList,
      eventTypeList,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Evento Sanitário" />
            <Form
              onSubmit={this.onSubmit}
              mutators={{
                ...arrayMutators,
              }}
              initialValues={{ ...sanitaries }}
              validate={this.validate}
              render={({
                handleSubmit,
                invalid,
                pristine,
                values,
                form: {
                  mutators: { push, pop },
                },
              }) => (
                <form onSubmit={handleSubmit}>
                  <Card style={{ marginTop: 20 }}>
                    <CardContent>
                      <div className="card-header">
                        <Typography variant="headline" className="card-header_title">
                          Dados gerais
                        </Typography>
                      </div>
                      <div className="card-body">
                        <InputForm name="id" type="hidden" />
                        <InputForm
                          name="date"
                          required={true}
                          type="date"
                          label="Data"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                        {explorationList && (
                          <FormControl
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                          >
                            <InputLabel>Exploração</InputLabel>
                            <Select
                              name="exploration"
                              value={exploration}
                              onChange={this.handleExplorationChange.bind(this, values)}
                            >
                              {explorationList.map(ex => {
                                return (
                                  <MenuItem key={ex.id} value={ex.id}>
                                    {ex.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        )}
                        {eventTypeList && (
                          <SelectForm
                            name="eventType"
                            required={true}
                            label="Tipo de evento"
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            list={eventTypeList}
                          />
                        )}
                        <InputForm
                          name="cost"
                          required={false}
                          type="number"
                          label="Custo"
                          step="0.01"
                          inputAdornment="€"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          name="vet"
                          required={false}
                          type="text"
                          label="Nome do veterinário"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          name="observations"
                          required={false}
                          type="text"
                          label="Observações"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <FieldArray name="animalData" validate={this.validateArray}>
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Card style={{ marginTop: 20 }} key={name}>
                          <CardContent>
                            <div className="card-header">
                              <Typography variant="headline" className="card-header_title">
                                {index + 1}. Animal
                              </Typography>
                              <i className="material-icons" onClick={() => fields.remove(index)}>
                                delete
                              </i>
                            </div>
                            <div className="card-body">
                              <InputForm
                                name={`${name}.management`}
                                required={false}
                                type="hidden"
                              />
                              {animalList && (
                                <SelectForm
                                  name={`${name}.animal`}
                                  required={true}
                                  label="Animal"
                                  style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                                  list={animalList}
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </FieldArray>

                  <Card style={{ marginTop: 20 }}>
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="headline" style={{ flexGrow: 1 }}>
                        Adicionar animal
                      </Typography>
                      <i className="material-icons" onClick={() => push('animalData')}>
                        add
                      </i>
                    </CardContent>
                  </Card>
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
                </form>
              )}
            />
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

export default CreateorUpdateSanitaryManagementPage;
