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
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';
import AnimalService from '../../../../services/AnimalService';
import FixedValuesService from '../../../../services/FixedValuesService';
import ManagementProductionService from '../../../../services/ManagementProductionService';
import { I18nContext } from '../../../App';
import { formatAnimalList } from '../../../utils/FormatUtils';
import * as ProductionTypes from '../../../../constants/ProductionTypes';

class CreateorUpdateProductionManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      animalList: '',
      exploration: '',
      productionType: '',
      productionTypes: null,
      inputAdornment: '',
      productions: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  getQuantity = productionType => {
    switch (productionType) {
      case ProductionTypes.CATTLE_BREEDING:
        return 'uni';
      case ProductionTypes.MEAT:
        return 'kg';
      case ProductionTypes.MILK:
        return 'L';
      case ProductionTypes.WOOL:
        return 'kg';
      default:
        return '';
    }
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId, id } = this.props.match.params;

    let explorationsPromise = ExplorationService.get(null, entityId, true);
    let productionTypesPromise = FixedValuesService.getProductionTypes(true);

    if (id) {
      this.setState({ id });
      const getProductionResponse = ManagementProductionService.get(id, entityId, true);

      getProductionResponse
        .then(res => {
          this.setState({
            productions: res.data,
            exploration: res.data.exploration,
            productionType: res.data.productionType,
            inputAdornment: this.getQuantity(res.data.productionType),
          });
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

    productionTypesPromise
      .then(res => {
        this.setState({ productionTypes: res.data });
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
          let animalPromise = AnimalService.get(null, res.data[0].id, true);

          animalPromise
            .then(res => {
              this.setState({ animalList: res.data, isLoading: false });
            })
            .catch(err => this.setState({ serverError: true, isLoading: false }));
        }
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    const { exploration, productionType } = this.state;
    this.setState({ isLoading: true });
    values.managementType = 12;
    values.agricolaEntity = entityId;
    values.exploration = exploration;
    values.productionType = productionType;
    if (values.id) {
      let updateProductionResponse = ManagementProductionService.update(values, true);

      updateProductionResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createProductionResponse = ManagementProductionService.create(values, true);

      createProductionResponse
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

  handleProductionTypeChange = async (values, e) => {
    values.productionType = e.target.value;

    if (values.animalData) values.animalData = undefined;

    this.setState({
      productionType: e.target.value,
      inputAdornment: this.getQuantity(e.target.value),
    });
  };

  validateArray = (fields, i18n) => {
    const errors = {};
    if (fields) {
      fields.forEach(element => {
        if (element !== undefined) {
          if (!element.animal) errors.animal = i18n.management.errors.required;
        } else {
          errors.data = i18n.management.errors.required;
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
      productionType,
      animalList,
      productionTypes,
      productions,
      inputAdornment,
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
                  title={i18n.management.managementType.production}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...productions }}
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
                              <Grid item xs={3}>
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
                            {productionTypes && (
                              <Grid item xs={3}>
                                <FormControl fullWidth>
                                  <InputLabel>{i18n.management.productionType}</InputLabel>
                                  <Select
                                    name="productionType"
                                    value={productionType}
                                    onChange={this.handleProductionTypeChange.bind(this, values)}
                                  >
                                    {productionTypes.map(ex => {
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
                        productionType &&
                        animalList.length > 0 && (
                          <Fragment>
                            <FieldArray
                              name="animalData"
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
                                        {animalList && (
                                          <Grid item xs={6}>
                                            <SelectForm
                                              label="Animal"
                                              name={`${name}.animal`}
                                              required={true}
                                              list={formatAnimalList(animalList)}
                                              fullWidth
                                            />
                                          </Grid>
                                        )}

                                        <Grid item xs={6}>
                                          <InputForm
                                            label={i18n.management.qty}
                                            name={`${name}.qty`}
                                            required={false}
                                            type="number"
                                            inputAdornment={inputAdornment}
                                            fullWidth
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
                                  {i18n.management.addMoreProduction}
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

export default CreateorUpdateProductionManagementPage;
