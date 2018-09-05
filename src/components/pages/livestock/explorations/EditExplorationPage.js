import React, { Fragment, Component } from 'react';
import {
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Input,
  Button,
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

class EditExplorationPage extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      agricolaEntityId: 0,
      name: '',
      number: '',
      addressId: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      productionTypes: [],
      explorationSystems: [],
      isLoading: false,
      serverError: false,
      errors: null,
      types: [],
      productions: [],
      explorationSystem: '',
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    let getOneExplorationPromise = ExplorationService.get(this.props.match.params.id, null, true);

    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    let explorationSystemPromise = FixedValuesService.getExplorationSystem(true);
    let productionTypePromise = FixedValuesService.getProductionTypes(true);

    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    explorationSystemPromise
      .then(res => {
        this.setState({ explorationSystems: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    productionTypePromise
      .then(res => {
        this.setState({ productionTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    getOneExplorationPromise
      .then(res => {
        this.setState({
          id: res.data.id ? res.data.id : '',
          agricolaEntityId: res.data.agricolaEntityId ? res.data.agricolaEntityId : '',
          addressId: res.data.address && res.data.address.id ? res.data.address.id : '',
          address: res.data.address && res.data.address.detail ? res.data.address.detail : '',
          district: res.data.address && res.data.address.district ? res.data.address.district : '',
          postalCode:
            res.data.address && res.data.address.postalCode ? res.data.address.postalCode : '',
          name: res.data.name ? res.data.name : '',
          number: res.data.number ? res.data.number : '',
          types: res.data.explorationTypes ? res.data.explorationTypes.map(elem => elem.name) : '',
          productions: res.data.productionTypes
            ? res.data.productionTypes.map(elem => elem.name)
            : '',
          explorationSystem: res.data.explorationSystem && res.data.explorationSystem.id ? res.data.explorationSystem.id : '',
          isLoading: false,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onDialogClose = e => {
    this.setState({ errors: null, serverError: null });
    e.preventDefault();
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  };

  onCancel = e => {
    const entityId = this.props.match.params.entityId;
    const id = this.props.match.params.id;
    this.props.history.push(`/livestock/explorations/${entityId}/detail/${id}`);
  };

  onSave = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const {
      id,
      name,
      number,
      agricolaEntityId,
      addressId,
      address,
      postalCode,
      district,
      explorationSystem,
      types,
      productions,
    } = this.state;

    let errors = ExplorationValidations.validateCreateOrUpdateExploration(name, types);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let explorationTypeIds = types.map(
        elem => this.state.explorationTypes.find(exp => exp.name === elem).id,
      );
      let productionTypeIds = productions.map(
        elem => this.state.productionTypes.find(exp => exp.name === elem).id,
      );
      let updateExplorationResponse = ExplorationService.updateExploration(
        {
          id,
          agricolaEntityId,
          name,
          number,
          address: {
            id: addressId,
            detail: address,
            district,
            postalCode,
          },
          explorationSystem,
          explorationTypes: explorationTypeIds,
          productionTypes: productionTypeIds,
        },
        true,
      );

      updateExplorationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(
            `/livestock/explorations/${agricolaEntityId}/detail/${res.data.id}`,
          );
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  render() {
    const { isLoading, explorationTypes, explorationSystems, explorationSystem, productionTypes, errors, serverError } = this.state;
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
                      <FormControl fullWidth>
                        <InputLabel>{i18n.exploration.name}</InputLabel>
                        <Input name="name" value={this.state.name} onChange={this.handleChange} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>{i18n.exploration.number}</InputLabel>
                        <Input
                          name="number"
                          value={this.state.number}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
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
                      <FormControl fullWidth>
                        <InputLabel>{i18n.exploration.address}</InputLabel>
                        <Input
                          name="address"
                          value={this.state.address}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>{i18n.exploration.district}</InputLabel>
                        <Input
                          name="district"
                          value={this.state.district}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
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
                    onClick={this.onSave}
                  >
                    {i18n.exploration.button.save}
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

export default EditExplorationPage;
