import React, { Component, Fragment } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  ListItemText,
  Grid,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationValidations from '../../../../validations/ExplorationValidations';
import { I18nContext } from '../../../App';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class CreateExplorationPage extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      number: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      explorationTypeIds: [],
      types: [],
      isLoading: false,
      serverError: false,
      errors: null,
      productionTypes: [],
      productionTypeIds: [],
      productions: [],
      explorationSystem: '',
      explorationSystems: [],
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    let productionTypePromise = FixedValuesService.getProductionTypes(true);
    let explorationSystemPromise = FixedValuesService.getExplorationSystem(true);
    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
    productionTypePromise
      .then(res => {
        this.setState({ productionTypes: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
    explorationSystemPromise
      .then(res => {
        this.setState({ explorationSystems: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  };

  onCreate = (e, i18n) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const {
      name,
      number,
      address,
      postalCode,
      district,
      types,
      productions,
      explorationSystem,
    } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateExploration(name, types, i18n);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let explorationTypeIds = types.map(
        elem => this.state.explorationTypes.find(exp => exp.name === elem).id,
      );
      let productionTypeIds = productions.map(
        elem => this.state.productionTypes.find(prod => prod.name === elem).id,
      );
      let createExplorationResponse = ExplorationService.createExploration(
        {
          agricolaEntityId: this.props.match.params.id,
          name,
          number,
          address: {
            detail: address,
            district,
            postalCode,
          },
          explorationTypes: explorationTypeIds,
          productionTypes: productionTypeIds,
          explorationSystem: explorationSystem,
        },
        true,
      );

      createExplorationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(
            `/livestock/explorations/${this.props.match.params.id}/detail/${res.data.id}`,
          );
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  onCancel = e => {
    const id = this.props.match.params.id;
    this.props.history.push(`/livestock/explorations/${id}`);
  };

  render() {
    const {
      isLoading,
      explorationTypes,
      productionTypes,
      explorationSystems,
      explorationSystem,
      errors,
      serverError,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Card>
                <CardContent>
                  <div className="card-header">
                    <Typography variant="headline" className="card-header_title">
                      {i18n.exploration.explorationTitle}
                    </Typography>
                  </div>
                  <Grid container spacing={16} style={{ marginBottom: 20 }}>
                    <Grid item xs={4}>
                      <FormControl fullWidth={true}>
                        <InputLabel>{i18n.exploration.name}</InputLabel>
                        <Input name="name" value={this.state.name} onChange={this.handleChange} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth={true}>
                        <InputLabel>{i18n.exploration.number}</InputLabel>
                        <Input
                          name="number"
                          value={this.state.number}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth={true}>
                        <InputLabel htmlFor="select-multiple-checkbox">
                          {i18n.exploration.explorationType}*
                        </InputLabel>
                        <Select
                          multiple
                          name="types"
                          value={this.state.types}
                          onChange={this.handleChange}
                          input={<Input id="select-multiple-checkbox" />}
                          renderValue={selected => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {explorationTypes.map(explorationType => (
                            <MenuItem key={explorationType.id} value={explorationType.name}>
                              <Checkbox
                                color="primary"
                                checked={this.state.types.indexOf(explorationType.name) > -1}
                              />
                              <ListItemText primary={explorationType.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth={true}>
                        <InputLabel>{i18n.exploration.address}</InputLabel>
                        <Input
                          name="address"
                          value={this.state.address}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth={true}>
                        <InputLabel>{i18n.exploration.district}</InputLabel>
                        <Input
                          name="district"
                          value={this.state.district}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth={true}>
                        <InputLabel>{i18n.exploration.postalCode}</InputLabel>
                        <Input
                          name="postalCode"
                          value={this.state.postalCode}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    {explorationSystems && (
                      <Grid item xs={6}>
                        <FormControl fullWidth={true}>
                          <InputLabel>{i18n.exploration.explorationSystem}</InputLabel>
                          <Select
                            name="explorationSystem"
                            value={explorationSystem}
                            onChange={this.handleChange}
                          >
                            {explorationSystems.map(explorationSystem => {
                              return (
                                <MenuItem key={explorationSystem.id} value={explorationSystem.id}>
                                  {explorationSystem.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <FormControl fullWidth={true}>
                        <InputLabel htmlFor="select-multiple-checkbox">
                          {i18n.exploration.productionType}*
                        </InputLabel>
                        <Select
                          multiple
                          name="productions"
                          value={this.state.productions}
                          onChange={this.handleChange}
                          input={<Input id="select-multiple-checkbox" />}
                          renderValue={selected => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {productionTypes.map(productionType => (
                            <MenuItem key={productionType.id} value={productionType.name}>
                              <Checkbox
                                color="primary"
                                checked={this.state.productions.indexOf(productionType.name) > -1}
                              />
                              <ListItemText primary={productionType.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
                <div className="card-actions">
                  <Button
                    size="medium"
                    variant="raised"
                    color="primary"
                    className="card-button"
                    onClick={this.onCancel}
                  >
                    {i18n.exploration.button.cancel}
                  </Button>
                  <Button
                    size="medium"
                    variant="raised"
                    color="primary"
                    className="card-button"
                    onClick={e => this.onCreate(e, i18n)}
                  >
                    {i18n.exploration.button.create}
                  </Button>
                </div>
              </Card>
            )}
            {errors && (
              <ErrorDialog
                title={i18n.general.inputErrorTitle}
                text={i18n.general.genericErrorMessage}
                onDialogClose={this.onDialogClose}
              />
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

export default CreateExplorationPage;
