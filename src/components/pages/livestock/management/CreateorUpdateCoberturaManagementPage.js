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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCoberturaService from '../../../../services/ManagementCoberturaService';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';
import AnimalService from '../../../../services/AnimalService';

class CreateorUpdateCoberturaManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      coberturaTypes: null,
      femaleList: '',
      maleList: '',
      exploration: '',
      cobertura: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId, id } = this.props.match.params;

    let explorationsPromise = ExplorationService.get(null, entityId, true);
    let coberturaTypesPromise = FixedValuesService.getCoberturaTypes(true);

    if (id) {
      this.setState({ id });
      const getCoberturasResponse = ManagementCoberturaService.get(id, entityId, true);

      getCoberturasResponse
        .then(res => {
          let animalMalePromise = AnimalService.getAnimalBySex(
            1,
            entityId,
            res.data.exploration,
            true,
          );

          let animalFemalePromise = AnimalService.getAnimalBySex(
            2,
            entityId,
            res.data.exploration,
            true,
          );

          animalMalePromise
            .then(res => {
              this.setState({ maleList: res.data });
            })
            .catch(err => {
              this.setState({ serverError: true });
            });

          animalFemalePromise
            .then(res => {
              this.setState({ femaleList: res.data });
            })
            .catch(err => this.setState({ serverError: true }));

          this.setState({ cobertura: res.data, exploration: res.data.exploration });
        })
        .catch(err => {
          this.setState({ serverError: true });
        });
    }

    coberturaTypesPromise
      .then(res => {
        this.setState({ coberturaTypes: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true });
      });

    explorationsPromise
      .then(res => {
        this.setState({ explorationList: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    const { exploration } = this.state;
    this.setState({ isLoading: true });
    values.managementType = 6;
    values.agricolaEntity = entityId;
    values.exploration = exploration;
    if (values.id) {
      let updateCoberturaResponse = ManagementCoberturaService.update(values, true);

      updateCoberturaResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createCoberturaResponse = ManagementCoberturaService.create(values, true);

      createCoberturaResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  handleExplorationChange = async (values, e) => {
    const { entityId } = this.props.match.params;
    values.exploration = e.target.value;
    this.setState({ exploration: e.target.value, isLoading: true });

    let animalMalePromise = AnimalService.getAnimalBySex(1, entityId, e.target.value, true);

    let animalFemalePromise = AnimalService.getAnimalBySex(2, entityId, e.target.value, true);

    animalMalePromise
      .then(res => {
        this.setState({ maleList: res.data });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    animalFemalePromise
      .then(res => {
        this.setState({ femaleList: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  validateArray = fields => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.female) errors.female = 'Required';
          if (!element.coberturaType) errors.coberturaType = 'Required';
        } else {
          errors.female = 'Required';
        }
      });
    }
    return errors;
  };

  //TODO
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

    if (!values.animalSexData || !values.animalSexData.length > 0) {
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
      explorationList,
      exploration,
      femaleList,
      maleList,
      coberturaTypes,
      cobertura,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Cobertura" />
            <Form
              onSubmit={this.onSubmit}
              mutators={{
                ...arrayMutators,
              }}
              initialValues={{ ...cobertura }}
              validate={this.validate}
              render={({
                handleSubmit,
                pristine,
                invalid,
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
                  {exploration &&
                    femaleList.length > 0 && (
                      <Fragment>
                        <FieldArray name="animalSexData" validate={this.validateArray}>
                          {({ fields }) =>
                            fields.map((name, index) => (
                              <Card style={{ marginTop: 20 }} key={name}>
                                <CardContent>
                                  <div className="card-header">
                                    <Typography variant="headline" className="card-header_title">
                                      {index + 1}. Cobertura
                                    </Typography>
                                    <i
                                      className="material-icons"
                                      onClick={() => fields.remove(index)}
                                    >
                                      delete
                                    </i>
                                  </div>
                                  <div className="card-body">
                                    {coberturaTypes && (
                                      <SelectForm
                                        label="Tipo de cobertura"
                                        name={`${name}.coberturaType`}
                                        required={true}
                                        list={coberturaTypes}
                                        style={{
                                          width: '45%',
                                          margin: '10px',
                                          marginBottom: '40px',
                                        }}
                                      />
                                    )}

                                    <Fragment>
                                      {femaleList && (
                                        <SelectForm
                                          label="Fêmea"
                                          name={`${name}.female`}
                                          required={true}
                                          list={femaleList}
                                          style={{
                                            width: '45%',
                                            margin: '10px',
                                            marginBottom: '40px',
                                          }}
                                        />
                                      )}
                                      {maleList &&
                                        fields.value[index] &&
                                        fields.value[index].coberturaType === 1 && (
                                          <SelectForm
                                            label="Macho"
                                            name={`${name}.male`}
                                            required={false}
                                            list={maleList}
                                            style={{
                                              width: '45%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                        )}
                                      {fields.value[index] &&
                                        fields.value[index].coberturaType === 2 && (
                                          <Fragment>
                                            <InputForm
                                              name={`${name}.dose`}
                                              required={false}
                                              type="number"
                                              label="Dose"
                                              inputAdornment="g"
                                              style={{
                                                width: '45%',
                                                margin: '10px',
                                                marginBottom: '40px',
                                              }}
                                            />
                                            <InputForm
                                              name={`${name}.vet`}
                                              required={false}
                                              type="text"
                                              label="Inseminador"
                                              style={{
                                                width: '45%',
                                                margin: '10px',
                                                marginBottom: '40px',
                                              }}
                                            />
                                          </Fragment>
                                        )}
                                    </Fragment>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          }
                        </FieldArray>
                        <Card style={{ marginTop: 20 }}>
                          <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="headline" style={{ flexGrow: 1 }}>
                              Adicionar uma cobertura
                            </Typography>
                            <i className="material-icons" onClick={() => push('animalSexData')}>
                              add
                            </i>
                          </CardContent>
                        </Card>
                      </Fragment>
                    )}
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
                      disabled={invalid || pristine}
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
            text="Existe um erro na comunicação com o servidor."
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

export default CreateorUpdateCoberturaManagementPage;
