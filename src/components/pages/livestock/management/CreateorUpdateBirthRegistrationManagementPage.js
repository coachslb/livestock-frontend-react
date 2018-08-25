import React, { Component, Fragment } from 'react';
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import InputForm from '../../../UI/Inputs/InputForm';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import SelectForm from '../../../UI/Inputs/SelectForm';
import { I18nContext } from '../../../App';
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementBirthRegistrationService from '../../../../services/ManagementBirthRegistrationService';

class CreateorUpdateBirthRegistrationManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      animalTypeList: null,
      animalType: '',
      sexTypes: null,
      breedList: null,
      currentBreedList: null,
      birthRegistration: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    const { animalType } = this.state;
    this.setState({ isLoading: true });
    values.managementType = 2;
    values.agricolaEntity = entityId;
    values.animalType = animalType;
    if (values.id) {
      let updateBirthRegistrationResponse = ManagementBirthRegistrationService.update(values, true);

      updateBirthRegistrationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createBirthRegistrationResponse = ManagementBirthRegistrationService.create(values, true);

      createBirthRegistrationResponse
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
          if (!element.number) errors.number = i18n.management.errors.required;
          if (!element.sex) errors.sex = i18n.management.errors.required;
        } else {
          errors.number = i18n.management.errors.required;
        }
      });
    }
    return errors;
  };

  //TODO
  validate = (values, i18n) => {
    const errors = {};
    if (!values.date) {
      errors.data = i18n.management.errors.required;
    }
    if (new Date(values.date) > new Date()) {
      errors.date = i18n.management.errors.invalidDate;
    }

    if (!values.exploration) {
      errors.exploration = i18n.management.errors.required;
    }
    if (!values.motherNumber) {
      errors.motherNumber = i18n.management.errors.required;
    }
    if (!this.state.animalType) {
      errors.animalType = i18n.management.errors.required;
    }

    if (!values.animalData) {
      errors.animalData = i18n.management.errors.required;
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

  componentWillMount() {
    const { entityId, id } = this.props.match.params;
    this.setState({ isLoading: true });

    const explorationsPromise = ExplorationService.get(null, entityId, true);
    const animalTypesPromise = FixedValuesService.getExplorationTypes(true);
    const sexTypesPromise = FixedValuesService.getSexTypes(true);
    const breedResponse = FixedValuesService.getBreeds(true);

    if (id) {
      this.setState({ id });
      const getBirthRegistrationResponse = ManagementBirthRegistrationService.get(
        id,
        entityId,
        true,
      );

      getBirthRegistrationResponse
        .then(res => {
          this.setState({ birthRegistration: res.data, animalType: res.data.animalType });
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    sexTypesPromise
      .then(res => this.setState({ sexTypes: res.data }))
      .catch(err => this.setState({ serverError: true }));

    breedResponse
      .then(res => {
        this.setState({ breedList: res.data, currentBreedList: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true });
      });

    animalTypesPromise
      .then(res => {
        this.setState({ animalTypeList: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    explorationsPromise
      .then(res => this.setState({ explorationList: res.data, isLoading: false }))
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  handleChangeAnimalType = e => {
    this.setState({
      animalType: e.target.value,
      currentBreedList:
        this.state.breedList &&
        this.state.breedList.filter(value => value.animalType === e.target.value),
    });
  };

  render() {
    const { entityId } = this.props.match.params;
    const {
      isLoading,
      serverError,
      explorationList,
      animalTypeList,
      animalType,
      sexTypes,
      birthRegistration,
      currentBreedList,
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
                  title={i18n.management.managementType.birth}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...birthRegistration }}
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
                          <Grid container spacing={16} className="card-body">
                            <InputForm name="id" type="hidden" />
                            <Grid item xs={3}>
                              <InputForm
                                name="date"
                                required={true}
                                type="date"
                                label={i18n.management.date}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              {animalTypeList && (
                                <SelectForm
                                  label={i18n.management.exploration}
                                  name="exploration"
                                  required
                                  list={explorationList}
                                  fullWidth
                                />
                              )}
                            </Grid>
                            <Grid item xs={3}>
                              {animalTypeList && (
                                <FormControl fullWidth>
                                  <InputLabel>{i18n.exploration.animals.animalType}*</InputLabel>
                                  <Select
                                    name="animalType"
                                    value={animalType}
                                    onChange={this.handleChangeAnimalType}
                                  >
                                    {animalTypeList.map(type => {
                                      return (
                                        <MenuItem key={type.id} value={type.id}>
                                          {type.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              )}
                            </Grid>
                            <Grid item xs={3}>
                              {currentBreedList && (
                                <SelectForm
                                  label={i18n.management.breed}
                                  name="breed"
                                  required
                                  fullWidth
                                  list={currentBreedList}
                                />
                              )}
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                label={i18n.management.motherNumber}
                                name="motherNumber"
                                required={true}
                                type="text"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                label={i18n.management.motherChipNumber}
                                name="motherChipNumber"
                                required={false}
                                type="text"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                label={i18n.management.fatherNumber}
                                name="fatherNumber"
                                required={false}
                                type="text"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <InputForm
                                label={i18n.management.fatherChipNumber}
                                name="fatherChipNumber"
                                required={false}
                                type="text"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <InputForm
                                label={i18n.management.obs}
                                name="observations"
                                required={false}
                                type="text"
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
                                  <InputForm name={`${name}.id`} required={false} type="hidden" />
                                  <Grid item xs={4}>
                                    <InputForm
                                      label={i18n.management.earingNumber}
                                      name={`${name}.number`}
                                      required={true}
                                      type="text"
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <InputForm
                                      label={i18n.management.chipNumber}
                                      name={`${name}.chipNumber`}
                                      required={false}
                                      type="text"
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    {sexTypes && (
                                      <SelectForm
                                        label={i18n.management.sex}
                                        name={`${name}.sex`}
                                        required={true}
                                        fullWidth
                                        list={sexTypes}
                                      />
                                    )}
                                  </Grid>
                                  <Grid item xs={4}>
                                    <InputForm
                                      label={i18n.management.bloodType}
                                      name={`${name}.bloodType`}
                                      required={false}
                                      type="text"
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <InputForm
                                      label={i18n.management.weight}
                                      name={`${name}.weight`}
                                      required={false}
                                      type="number"
                                      step="0.01"
                                      fullWidth
                                      inputAdornment="kg"
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </FieldArray>
                      <Card style={{ marginTop: 20 }}>
                        <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="headline" style={{ flexGrow: 1 }}>
                            {i18n.management.addMoreBirth}
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

export default CreateorUpdateBirthRegistrationManagementPage;
