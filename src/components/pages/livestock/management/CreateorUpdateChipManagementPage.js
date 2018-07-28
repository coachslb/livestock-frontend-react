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
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';
import AnimalService from '../../../../services/AnimalService';
import ManagementChipService from '../../../../services/ManagementChipService';

class CreateorUpdateChipManagementPage extends Component {

    constructor() {
        super();
        this.state = {
          isLoading: null,
          serverError: null,
          explorationList: null,
          animalList: '',
          exploration: '',
          chips: {
            date: new Date().toJSON().slice(0, 10),
          },
        };
      }
    
      componentWillMount() {
        this.setState({ isLoading: true });
        const { entityId, id } = this.props.match.params;
    
        let explorationsPromise = ExplorationService.get(null, entityId, true);

        if (id) {
          this.setState({ id });
          const getChipsResponse = ManagementChipService.get(id, entityId, true);
    
          getChipsResponse
            .then(res => {
              this.setState({ chips: res.data, exploration: res.data.exploration });
              let animalPromise = AnimalService.get(null, res.data.exploration, true);
    
              animalPromise
                .then(res => {
                  this.setState({ animalList: res.data, isLoading: false });
                })
                .catch(err => this.setState({ serverError: true, isLoading: false }));
            })
            .catch(err => {
              this.setState({ isLoading: false, serverError: true });
            });
        }

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
        values.managementType = 11;
        values.agricolaEntity = entityId;
        values.exploration = exploration;
        if (values.id) {
          let updateChipResponse = ManagementChipService.update(values, true);
    
          updateChipResponse
            .then(res => {
              this.setState({ isLoading: false });
              this.props.history.push(`/livestock/management/${entityId}`);
            })
            .catch(err => {
              this.setState({ serverError: true, isLoading: false });
            });
        } else {
          let createChipResponse = ManagementChipService.create(values, true);
    
          createChipResponse
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
        values.exploration = e.target.value;
        this.setState({ exploration: e.target.value, isLoading: true });
    
        if (values.animalData) values.animalData = undefined;
        //get animals
        let animalPromise = AnimalService.get(null, e.target.value, true);
    
        animalPromise
          .then(res => {
            this.setState({ animalList: res.data, isLoading: false });
          })
          .catch(err => this.setState({ serverError: true, isLoading: false }));
      };
    
      validateArray = fields => {
        const errors = {};
        if (fields) {
          fields.forEach(element => {
            if (element !== undefined) {
              if (!element.animal) errors.animal = 'Required';
              if (!element.chipNumber) errors.chipNumber = 'Required';
            } else {
              errors.data = 'Required';
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
          explorationList,
          exploration,
          animalList,
          chips,
        } = this.state;
        return (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <ManagementCreationCard step={2} entityId={entityId} title="Chipagem" />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...chips }}
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
                        animalList.length > 0 && (
                          <Fragment>
                            <FieldArray name="animalData" validate={this.validateArray}>
                              {({ fields }) =>
                                fields.map((name, index) => (
                                  <Card style={{ marginTop: 20 }} key={name}>
                                    <CardContent>
                                      <div className="card-header">
                                        <Typography variant="headline" className="card-header_title">
                                          {index + 1}. Animal
                                        </Typography>
                                        <i
                                          className="material-icons"
                                          onClick={() => fields.remove(index)}
                                        >
                                          delete
                                        </i>
                                      </div>
                                      <div className="card-body">
                                        {animalList && (
                                          <SelectForm
                                            label="Animal"
                                            name={`${name}.animal`}
                                            required={true}
                                            list={animalList}
                                            style={{
                                              width: '30%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                        )}
                                        <InputForm
                                          label="Número do chip"
                                          name={`${name}.chipNumber`}
                                          required={false}
                                          type="text"
                                          style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                              }
                            </FieldArray>
                            <Card style={{ marginTop: 20 }}>
                              <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="headline" style={{ flexGrow: 1 }}>
                                  Adicionar uma chipagem
                                </Typography>
                                <i className="material-icons" onClick={() => push('animalData')}>
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

export default CreateorUpdateChipManagementPage;