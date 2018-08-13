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
import ManagementWeighingService from '../../../../services/ManagementWeighingService';
import { I18nContext } from '../../../App';

class CreateorUpdateWeighingManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      exploration: '',
      weighing: {
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
      const getWeighingResponse = ManagementWeighingService.get(id, entityId, true);

      getWeighingResponse
        .then(res => {
          this.setState({ weighing: res.data, exploration: res.data.exploration });
          let animalPromise = AnimalService.get(null, res.data.exploration, true);

          animalPromise
            .then(res => {
              this.setState({ animalList: res.data });
            })
            .catch(err => this.setState({ serverError: true, isLoading: false }));
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data, isLoading: false });
    });
  }

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

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    const { exploration } = this.state;
    this.setState({ isLoading: true });
    values.managementType = 3;
    values.agricolaEntity = entityId;
    values.exploration = exploration;
    if (values.id) {
      let updateWeighingResponse = ManagementWeighingService.update(values, true);

      updateWeighingResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createWeighingResponse = ManagementWeighingService.create(values, true);

      createWeighingResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  validateArray = (fields, i18n) => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.weight) errors.weight = i18n.management.errors.required;
          if (!element.animal) errors.animal = i18n.management.errors.required;
        } else {
          errors.number = i18n.management.errors.required;
        }
      });
    }
    return errors;
  };

  validate = (values, i18n) => {
    const errors = {};
    if (!values.date) {
      errors.date = i18n.management.errors.required;
    }

    if (new Date(values.date) > new Date()) {
      errors.date = i18n.management.errors.invalidDate;
    }

    if (!values.exploration) {
      errors.exploration = i18n.management.errors.required;
    }

    if (!values.animalData || !values.animalData.length > 0) {
      errors.data = i18n.management.errors.required;
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
      weighing,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <ManagementCreationCard step={2} entityId={entityId} title={i18n.management.managementType.weighing}/>
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...weighing }}
                  validate={fields => this.validate(fields, i18n)}
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
                              {i18n.management.generalData}
                            </Typography>
                          </div>
                          <div className="card-body">
                            <InputForm
                              name="date"
                              required={true}
                              type="date"
                              label={i18n.management.date}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                            {explorationList && (
                              <FormControl
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              >
                                <InputLabel required>{i18n.management.exploration}</InputLabel>
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
                              label={i18n.management.obs}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      {exploration &&
                        animalList &&
                        animalList.length > 0 && (
                          <Fragment>
                            <FieldArray name="animalData" validate={fields => this.validateArray(fields, i18n)}>
                              {({ fields }) =>
                                fields.map((name, index) => (
                                  <Card style={{ marginTop: 20 }} key={name}>
                                    <CardContent>
                                      <div className="card-header">
                                        <Typography
                                          variant="headline"
                                          className="card-header_title"
                                        >
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
                                          label={i18n.management.weight}
                                          name={`${name}.weight`}
                                          required={true}
                                          type="number"
                                          style={{
                                            width: '30%',
                                            margin: '10px',
                                            marginBottom: '40px',
                                          }}
                                        />
                                        <InputForm
                                          label={i18n.management.weighingReason}
                                          name={`${name}.reason`}
                                          required={false}
                                          type="text"
                                          style={{
                                            width: '30%',
                                            margin: '10px',
                                            marginBottom: '40px',
                                          }}
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
                                  {i18n.management.addAnimal}
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
                          {i18n.management.button.cancel}
                        </Button>
                        <Button
                          size="medium"
                          variant="raised"
                          color="primary"
                          className="card-button"
                          type="submit"
                          disabled={pristine || invalid}
                        >
                          {i18n.management.button.save}
                        </Button>
                      </div>
                    </form>
                  )}
                />
              </Fragment>
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
                style={{
                  height: '80px',
                  width: '80px',
                  top: '50%',
                  left: '50%',
                  position: 'fixed',
                }}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default CreateorUpdateWeighingManagementPage;
