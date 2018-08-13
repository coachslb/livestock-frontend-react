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
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementFeedingService from '../../../../services/ManagementFeedingService';
import GroupService from '../../../../services/GroupService';
import { I18nContext } from '../../../App';

class CreateorUpdateFeedManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      exploration: '',
      explorationList: null,
      groupList: null,
      feeding: {
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
      const getFeedingResponse = ManagementFeedingService.get(id, entityId, true);

      getFeedingResponse
        .then(res => {
          this.setState({ feeding: res.data, exploration: res.data.exploration });
          const getGroupResponse = GroupService.get(null, res.data.exploration, true);

          getGroupResponse
            .then(res => {
              this.setState({ groupList: res.data, isLoading: false });
            })
            .catch(err => {
              this.setState({ isLoading: false, serverError: true });
            });
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

    //get groups
    if (values.foodData) values.foodData = undefined;

    const getGroupResponse = GroupService.get(null, e.target.value, true);

    getGroupResponse
      .then(res => {
        this.setState({ groupList: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  };

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    this.setState({ isLoading: true });
    values.managementType = 4;
    values.agricolaEntity = entityId;
    values.exploration = this.state.exploration;
    if (values.id) {
      let updateFeedingResponse = ManagementFeedingService.update(values, true);

      updateFeedingResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createFeedingResponse = ManagementFeedingService.create(values, true);

      createFeedingResponse
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
          if (!element.food) errors.food = i18n.management.errors.required;
          if (!element.qty) errors.qty = i18n.management.errors.required;
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
      errors.date = i18n.management.errors.required;
    }
    if (new Date(values.date) > new Date()) {
      errors.date = i18n.management.errors.invalidDate;
    }

    if (!this.state.exploration) {
      errors.exploration = i18n.management.errors.required;
    }

    if (!values.group) {
      errors.group = i18n.management.errors.required;
    }

    if (!values.foodData || !values.foodData.length > 0) {
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
    const { isLoading, serverError, exploration, explorationList, feeding, groupList } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <ManagementCreationCard
                  step={2}
                  entityId={entityId}
                  title={i18n.management.managementType.feeding}
                />
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{ ...feeding }}
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
                            <InputForm name="id" type="hidden" />
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
                      {groupList && (
                        <Card style={{ marginTop: 20 }}>
                          <CardContent>
                            <div className="card-header">
                              <Typography variant="headline" className="card-header_title">
                                {i18n.management.animalGroup}
                              </Typography>
                            </div>
                            <div className="card-body">
                              <SelectForm
                                name="group"
                                required={true}
                                label={i18n.management.group}
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                                list={groupList}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {exploration &&
                        values.group && (
                          <Fragment>
                            <FieldArray
                              name="foodData"
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
                                          {index + 1}. {i18n.management.food}
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
                                          label={i18n.management.food}
                                          name={`${name}.food`}
                                          required={true}
                                          type="text"
                                          style={{
                                            width: '45%',
                                            margin: '10px',
                                            marginBottom: '40px',
                                          }}
                                        />
                                        <InputForm
                                          label={i18n.management.qty}
                                          name={`${name}.qty`}
                                          required={false}
                                          type="number"
                                          inputAdornment="kg"
                                          style={{
                                            width: '45%',
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
                                  {i18n.management.addMoreFood}
                                </Typography>
                                <i className="material-icons" onClick={() => push('foodData')}>
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

export default CreateorUpdateFeedManagementPage;
