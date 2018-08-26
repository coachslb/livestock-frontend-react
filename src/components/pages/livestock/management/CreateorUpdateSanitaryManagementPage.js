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
  Grid,
} from 'material-ui';
import SelectForm from '../../../UI/Inputs/SelectForm';
import InputForm from '../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementSanitaryService from '../../../../services/ManagementSanitaryService';
import FixedValuesService from '../../../../services/FixedValuesService';
import AnimalService from '../../../../services/AnimalService';
import { I18nContext } from '../../../App';
import { formatAnimalList } from '../../../utils/FormatUtils';

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

  validateArray = (fields, i18n) => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.animal) errors.animal = i18n.management.errors.required;
        } else {
          errors.animal = i18n.management.errors.required;
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

    if (!this.state.exploration) {
      errors.exploration = i18n.management.errors.required;
    }

    if (!values.eventType) {
      errors.eventType = i18n.management.errors.required;
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
      exploration,
      explorationList,
      sanitaries,
      animalList,
      eventTypeList,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <ManagementCreationCard
                  step={2}
                  entityId={entityId}
                  title={i18n.management.managementType.sanitary}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...sanitaries }}
                  validate={fields => this.validate(fields, i18n)}
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
                              {i18n.management.generalData}
                            </Typography>
                          </div>
                          <Grid container spacing={16} className="card-body">
                            <InputForm name="id" type="hidden" />
                            <Grid item xs={6}>
                              <InputForm
                                name="date"
                                required={true}
                                type="date"
                                label={i18n.management.date}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={6}>
                              {explorationList && (
                                <FormControl fullWidth>
                                  <InputLabel>{i18n.management.exploration}</InputLabel>
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
                            </Grid>
                            <Grid item xs={6}>
                              {eventTypeList && (
                                <SelectForm
                                  name="eventType"
                                  required={true}
                                  label={i18n.management.eventType}
                                  fullWidth
                                  list={eventTypeList}
                                />
                              )}
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                name="vet"
                                required={false}
                                type="text"
                                label={i18n.management.veterinaryName}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                name="cost"
                                required={false}
                                type="number"
                                label={i18n.management.cost}
                                step="0.01"
                                inputAdornment="€"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <InputForm
                                name="observations"
                                required={false}
                                type="text"
                                label={i18n.management.obs}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      <FieldArray
                        name="animalData"
                        validate={fields => this.validateArray(fields, i18n)}
                      >
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
                                <Grid container spacing={16} className="card-body">
                                  <InputForm
                                    name={`${name}.management`}
                                    required={false}
                                    type="hidden"
                                  />

                                  {animalList && (
                                    <Grid item xs={6}>
                                      <SelectForm
                                        name={`${name}.animal`}
                                        required={true}
                                        label="Animal"
                                        fullWidth
                                        list={formatAnimalList(animalList)}
                                      />
                                    </Grid>
                                  )}
                                </Grid>
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

export default CreateorUpdateSanitaryManagementPage;
