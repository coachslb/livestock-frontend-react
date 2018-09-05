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
  Grid,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCoberturaService from '../../../../services/ManagementCoberturaService';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';
import AnimalService from '../../../../services/AnimalService';
import { I18nContext } from '../../../App';
import { formatAnimalList } from '../../../utils/FormatUtils';

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
        this.setState({
          explorationList: res.data,
          exploration: res.data.length === 1 ? res.data[0].id : '',
          isLoading: false,
        });

        if (res.data.length === 1) {
          let animalMalePromise = AnimalService.getAnimalBySex(1, entityId, res.data[0].id, true);

          let animalFemalePromise = AnimalService.getAnimalBySex(2, entityId, res.data[0].id, true);

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
        }
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

  validateArray = (fields, i18n) => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.female) errors.female = i18n.management.errors.required;
          if (!element.coberturaType) errors.coberturaType = i18n.management.errors.required;
        } else {
          errors.female = i18n.management.errors.required;
        }
      });
    }
    return errors;
  };

  //TODO
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

    if (!values.animalSexData || !values.animalSexData.length > 0) {
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
      femaleList,
      maleList,
      coberturaTypes,
      cobertura,
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
                  title={i18n.management.managementType.servicing}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...cobertura }}
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
                            <Grid item xs={6}>
                              <InputForm
                                name="date"
                                required={true}
                                type="date"
                                label={i18n.management.date}
                                fullWidth
                              />
                            </Grid>

                            {explorationList && (
                              <Grid item xs={6}>
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
                              </Grid>
                            )}
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
                      {exploration &&
                        femaleList.length > 0 && (
                          <Fragment>
                            <FieldArray
                              name="animalSexData"
                              validate={fields => this.validateArray(fields, i18n)}
                            >
                              {({ fields }) =>
                                fields.map((name, index) => (
                                  <Card style={{ marginTop: 20 }} key={name}>
                                    <CardContent>
                                      <div className="card-header">
                                        <Typography
                                          variant="headline"
                                          className="card-header_title"
                                        >
                                          {index + 1}. {i18n.management.managementType.servicing}
                                        </Typography>
                                        <i
                                          className="material-icons"
                                          onClick={() => fields.remove(index)}
                                        >
                                          delete
                                        </i>
                                      </div>
                                      <Grid container spacing={16} className="card-body">
                                        {coberturaTypes && (
                                          <Grid item xs={6}>
                                            <SelectForm
                                              label={i18n.management.servicingType}
                                              name={`${name}.coberturaType`}
                                              required={true}
                                              list={coberturaTypes}
                                              fullWidth
                                            />
                                          </Grid>
                                        )}
                                        <Fragment>
                                          {femaleList && (
                                            <Grid item xs={6}>
                                              <SelectForm
                                                label={i18n.management.female}
                                                name={`${name}.female`}
                                                required={true}
                                                list={formatAnimalList(femaleList)}
                                                fullWidth
                                              />
                                            </Grid>
                                          )}
                                          {maleList &&
                                            fields.value[index] &&
                                            fields.value[index].coberturaType === 1 && (
                                              <Grid item xs={6}>
                                                <SelectForm
                                                  label={i18n.management.male}
                                                  name={`${name}.male`}
                                                  required={false}
                                                  list={formatAnimalList(maleList)}
                                                  fullWidth
                                                />
                                              </Grid>
                                            )}
                                          {fields.value[index] &&
                                            fields.value[index].coberturaType === 2 && (
                                              <Fragment>
                                                <Grid item xs={6}>
                                                  <InputForm
                                                    name={`${name}.dose`}
                                                    required={false}
                                                    type="number"
                                                    label={i18n.management.dose}
                                                    inputAdornment="g"
                                                    fullWidth
                                                  />
                                                </Grid>
                                                <Grid item xs={6}>
                                                  <InputForm
                                                    name={`${name}.vet`}
                                                    required={false}
                                                    type="text"
                                                    label={i18n.management.inseminator}
                                                    fullWidth
                                                  />
                                                </Grid>
                                              </Fragment>
                                            )}
                                        </Fragment>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                ))
                              }
                            </FieldArray>
                            <Card style={{ marginTop: 20 }}>
                              <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="headline" style={{ flexGrow: 1 }}>
                                  {i18n.management.addMoreServicing}
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
                          {i18n.management.button.cancel}
                        </Button>
                        <Button
                          size="medium"
                          variant="raised"
                          color="primary"
                          className="card-button"
                          type="submit"
                          disabled={invalid || pristine}
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

export default CreateorUpdateCoberturaManagementPage;
