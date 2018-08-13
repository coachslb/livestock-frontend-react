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
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationService from '../../../../services/ExplorationService';
import AnimalService from '../../../../services/AnimalService';
import ManagementSellOrPurchaseService from '../../../../services/ManagementSellOrPurchaseService';
import ManagementService from '../../../../services/ManagementService';
import { I18nContext } from '../../../App';

class CreateorUpdateSellorPurchaseManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      animalTypes: null,
      sexTypes: null,
      animalList: '',
      exploration: '',
      types: null,
      type: '',
      sellorPurchase: {
        date: new Date().toJSON().slice(0, 10),
        type: 1,
      },
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId, id } = this.props.match.params;

    let explorationsPromise = ExplorationService.get(null, entityId, true);
    let animalTypesPromise = FixedValuesService.getExplorationTypes(true);
    let sexTypesPromise = FixedValuesService.getSexTypes(true);

    const sellOrPurchasePromise = FixedValuesService.getSellOrPurchase(true);

    if (id) {
      this.setState({ id });

      const getManagementTypePromise = ManagementService.getType(id, true);

      getManagementTypePromise
        .then(res => {
          if (res.data === 7) {
            const getSellResponse = ManagementSellOrPurchaseService.getSell(id, entityId, true);

            getSellResponse
              .then(res => {
                this.setState({
                  sellorPurchase: res.data,
                  exploration: res.data.exploration,
                  type: 2,
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
          } else {
            const getPurchaseResponse = ManagementSellOrPurchaseService.getPurchase(
              id,
              entityId,
              true,
            );

            getPurchaseResponse
              .then(res => {
                this.setState({
                  sellorPurchase: res.data,
                  exploration: res.data.exploration,
                  type: 1,
                });
              })
              .catch(err => {
                this.setState({ isLoading: false, serverError: true });
              });
          }
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    sexTypesPromise
      .then(res => this.setState({ sexTypes: res.data }))
      .catch(err => this.setState({ serverError: true }));

    animalTypesPromise
      .then(res => {
        this.setState({ animalTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    explorationsPromise
      .then(res => {
        this.setState({ explorationList: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    sellOrPurchasePromise
      .then(res => {
        this.setState({ types: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    const { exploration, type } = this.state;
    this.setState({ isLoading: true });
    values.managementType = type === 1 ? 8 : 7;
    values.agricolaEntity = entityId;
    values.exploration = exploration;

    if (values.id) {
      if (type === 1) {
        let updatePurchaseResponse = ManagementSellOrPurchaseService.updatePurchase(values, true);

        updatePurchaseResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(`/livestock/management/${entityId}`);
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      } else {
        let updateSellResponse = ManagementSellOrPurchaseService.updateSell(values, true);

        updateSellResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(`/livestock/management/${entityId}`);
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      }
    } else {
      if (type === 1) {
        //Create Purchase
        let createPurchaseResponse = ManagementSellOrPurchaseService.createPurchase(values, true);

        createPurchaseResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(`/livestock/management/${entityId}`);
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      } else {
        //create sell
        let createSellResponse = ManagementSellOrPurchaseService.createSell(values, true);

        createSellResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(`/livestock/management/${entityId}`);
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      }
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
  handleTypeChange = async (values, e) => {
    values.type = e.target.value;
    this.setState({ type: e.target.value });
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
      types,
      type,
      animalList,
      sexTypes,
      animalTypes,
      sellorPurchase,
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
                  title={i18n.management.managementType.sellAndPurchase}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...sellorPurchase }}
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
                            {types && (
                              <FormControl
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              >
                                <InputLabel>{i18n.management.type}</InputLabel>
                                <Select
                                  name="type"
                                  value={type}
                                  onChange={this.handleTypeChange.bind(this, values)}
                                >
                                  {types.map(ex => {
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
                        type && (
                          <Fragment>
                            {type === 1 ? (
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
                                        <div className="card-body">
                                          <InputForm
                                            name={`${name}.id`}
                                            required={false}
                                            type="hidden"
                                          />
                                          <InputForm
                                            label={i18n.management.name}
                                            name={`${name}.name`}
                                            required={false}
                                            type="text"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.number}
                                            name={`${name}.number`}
                                            required={true}
                                            type="number"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.chipNumber}
                                            name={`${name}.chipNumber`}
                                            required={false}
                                            type="text"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          {animalTypes && (
                                            <SelectForm
                                              label={i18n.management.animalType}
                                              name={`${name}.explorationType`}
                                              required={true}
                                              style={{
                                                width: '22.5%',
                                                margin: '10px',
                                                marginBottom: '40px',
                                              }}
                                              list={animalTypes}
                                            />
                                          )}
                                          {sexTypes && (
                                            <SelectForm
                                              label={i18n.management.sex}
                                              name={`${name}.sex`}
                                              required={true}
                                              style={{
                                                width: '22.5%',
                                                margin: '10px',
                                                marginBottom: '40px',
                                              }}
                                              list={sexTypes}
                                            />
                                          )}
                                          <InputForm
                                            label={i18n.management.breed}
                                            name={`${name}.breed`}
                                            required={false}
                                            type="text"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.bloodType}
                                            name={`${name}.bloodType`}
                                            required={false}
                                            type="text"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            name={`${name}.birthDate`}
                                            required={false}
                                            type="date"
                                            label={i18n.management.birthDate}
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.weight}
                                            name={`${name}.weight`}
                                            required={false}
                                            type="number"
                                            step="0.01"
                                            inputAdornment="kg"
                                            style={{
                                              width: '22.5%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.value}
                                            name={`${name}.value`}
                                            required={false}
                                            type="number"
                                            inputAdornment="€"
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
                            ) : (
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
                                            required={false}
                                            type="number"
                                            inputAdornment="kg"
                                            style={{
                                              width: '30%',
                                              margin: '10px',
                                              marginBottom: '40px',
                                            }}
                                          />
                                          <InputForm
                                            label={i18n.management.value}
                                            name={`${name}.value`}
                                            required={false}
                                            type="number"
                                            inputAdornment="€"
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
                            )}
                            <Card style={{ marginTop: 20 }}>
                              <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="headline" style={{ flexGrow: 1 }}>
                                  {type === 1
                                    ? i18n.management.addMorePurchase
                                    : i18n.management.addMoreSell}
                                </Typography>
                                <i
                                  className="material-icons"
                                  onClick={() =>
                                    push('animalData', {
                                      birthDate: new Date().toJSON().slice(0, 10),
                                    })
                                  }
                                >
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

export default CreateorUpdateSellorPurchaseManagementPage;
