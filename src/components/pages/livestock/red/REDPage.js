import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../App';
import ExplorationService from '../../../../services/ExplorationService';
import EntityService from '../../../../services/EntityService';
import REDService from '../../../../services/REDService';
import { saveBlob } from '../../../utils/ExcelUtils';

class REDPage extends Component {
  constructor() {
    super();
    this.state = {
      exploration: '',
      explorationList: null,
      serverError: null,
      isLoading: null,
      addAnimals: false,
      addTransfers: false,
      addSanitaryEvents: false,
      year: '',
      name: '',
      nif: '',
      np: '',
      address: '',
      brand: '',
      phone: '',
      explorationName: '',
      explorationNumber: '',
      species: '',
      parcelNumber: '',
      explorationAddress: '',
      explorationParish: '',
      explorationCounty: '',
      explorationPostalCode: '',
      explorationSystem: '',
      explorationProduction: '',
      observations: '',
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true, year: new Date().getFullYear() });
    const entityId = localStorage.getItem('entityId');

    const explorationsPromise = ExplorationService.get(null, entityId, true);

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data, isLoading: false, exploration: res.data.length === 1 ? res.data[0].id : '', });

      if (res.data.length === 1) {
        //get exploration info
        const entityInfoResponse = EntityService.getOneEntity(entityId, true);
        const explorationResponse = ExplorationService.get(res.data[0].id, entityId, true);

        entityInfoResponse
          .then(res => {
            this.setState({
              isLoading: false,
              name: res.data.name,
              nif: res.data.nif,
              np: res.data.np,
              address: res.data.address
                ? res.data.address.detail + ' - ' + res.data.address.district || ''
                : '',
              brand: res.data.brand || '',
              phone: res.data.phone,
            });
          })
          .catch(err => this.setState({ serverError: true, isLoading: false }));

        explorationResponse
          .then(res => {
            this.setState({
              explorationName: res.data.name || '',
              explorationNumber: res.data.number || '',
              parcelNumber: res.data.parcelNumber || '',
              explorationAddress: res.data.address ? res.data.address.detail : '',
              explorationParish: '',
              explorationCounty: '',
              explorationPostalCode: res.data.address ? res.data.address.postalCode : '',
              explorationSystem:
                res.data.explorationSystem && res.data.explorationSystem.id
                  ? res.data.explorationSystem.name
                  : '',
              explorationProduction: res.data.productionTypes
                ? res.data.productionTypes
                    .reduce((acc, value) => (acc += value.name + ', '), '')
                    .slice(0, -2)
                : '',
              species: res.data.explorationTypes
                ? res.data.explorationTypes
                    .reduce((acc, value) => (acc += value.name + ', '), '')
                    .slice(0, -2)
                : '',
            });
            this.setState({ isLoading: false });
          })
          .catch(err => this.setState({ serverError: true, isLoading: false }));
      }
    });
  }

  onSwitchValue = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleExplorationChange = async (values, e) => {
    const entityId = localStorage.getItem('entityId');
    this.setState({ exploration: e.target.value, isLoading: true });

    //get exploration info
    const entityInfoResponse = EntityService.getOneEntity(entityId, true);
    const explorationResponse = ExplorationService.get(e.target.value, entityId, true);

    entityInfoResponse
      .then(res => {
        this.setState({
          isLoading: false,
          name: res.data.name,
          nif: res.data.nif,
          np: res.data.np,
          address: res.data.address
            ? res.data.address.detail + ' - ' + res.data.address.district || ''
            : '',
          brand: res.data.brand || '',
          phone: res.data.phone,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    explorationResponse
      .then(res => {
        this.setState({
          explorationName: res.data.name || '',
          explorationNumber: res.data.number || '',
          parcelNumber: res.data.parcelNumber || '',
          explorationAddress: res.data.address ? res.data.address.detail : '',
          explorationParish: '',
          explorationCounty: '',
          explorationPostalCode: res.data.address ? res.data.address.postalCode : '',
          explorationSystem:
            res.data.explorationSystem && res.data.explorationSystem.id
              ? res.data.explorationSystem.name
              : '',
          explorationProduction: res.data.productionTypes
            ? res.data.productionTypes
                .reduce((acc, value) => (acc += value.name + ', '), '')
                .slice(0, -2)
            : '',
          species: res.data.explorationTypes
            ? res.data.explorationTypes
                .reduce((acc, value) => (acc += value.name + ', '), '')
                .slice(0, -2)
            : '',
        });
        this.setState({ isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    return values;
  };

  validate = (values, i18n) => {
    const errors = {};
    return errors;
  };

  onSubmit = async values => {
    const {
      exploration,
      year,
      name,
      nif,
      np,
      address,
      brand,
      phone,
      explorationName,
      explorationNumber,
      parcelNumber,
      explorationAddress,
      explorationParish,
      explorationCounty,
      explorationPostalCode,
      explorationSystem,
      explorationProduction,
      species,
      observations,
      addAnimals,
      addTransfers,
      addSanitaryEvents,
    } = this.state;
    this.setState({ isLoading: true });
    const entityId = localStorage.getItem('entityId');

    const exportResponse = REDService.exportRED(
      {
        year,
        name,
        nif,
        np,
        userAddress: address,
        brand,
        explorationNumber,
        explorationName,
        explorationAddress,
        explorationPostalCode,
        explorationCounty,
        explorationParish,
        phone,
        parcelNumber,
        explorationSystem,
        explorationProduction,
        species,
        observations,
        addAnimals,
        addTransfers,
        addSanitaryEvents,
        entityId,
        explorationId: exploration,
      },
      true,
    );

    exportResponse
      .then(res => {
        saveBlob(
          res,
          `RED_${explorationName}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        this.setState({ isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const {
      isLoading,
      serverError,
      explorationList,
      exploration,
      year,
      name,
      nif,
      np,
      address,
      brand,
      phone,
      explorationName,
      explorationNumber,
      parcelNumber,
      explorationAddress,
      explorationParish,
      explorationCounty,
      explorationPostalCode,
      explorationSystem,
      explorationProduction,
      species,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
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
            {!isLoading && (
              <Form
                onSubmit={this.onSubmit}
                mutators={{
                  ...arrayMutators,
                }}
                initialValues={{ year: new Date().getFullYear() }}
                validate={fields => this.validate(fields, i18n)}
                render={({
                  handleSubmit,
                  invalid,
                  pristine,
                  values,
                  form,
                  form: {
                    mutators: { push, pop },
                  },
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Card style={{ marginTop: 20 }}>
                      <CardContent>
                        <div className="card-header">
                          <Typography
                            variant="headline"
                            className="card-header_title"
                            color="primary"
                          >
                            {i18n.red.title}
                          </Typography>
                          {explorationList && (
                            <FormControl
                              style={{
                                width: '45%',
                                margin: '10px',
                                marginBottom: '40px',
                              }}
                            >
                              <InputLabel>{i18n.management.exploration}</InputLabel>
                              <Select
                                name="exploration"
                                value={exploration}
                                onChange={this.handleExplorationChange.bind(this, values)}
                                disabled={explorationList.length === 1}
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
                        </div>
                        {explorationList &&
                          this.state.exploration && (
                            <Fragment>
                              <Grid container spacing={16} style={{ marginBottom: 20 }}>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.year}*</InputLabel>
                                    <Input
                                      name="year"
                                      value={year}
                                      onChange={this.handleChange}
                                      type="number"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.entityName}*</InputLabel>
                                    <Input
                                      name="name"
                                      value={name}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>NIF</InputLabel>
                                    <Input
                                      name="nif"
                                      value={nif}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.np}</InputLabel>
                                    <Input
                                      name="np"
                                      value={np}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.address}</InputLabel>
                                    <Input
                                      name="address"
                                      value={address}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.brand}</InputLabel>
                                    <Input
                                      name="brand"
                                      value={brand}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.phone}</InputLabel>
                                    <Input
                                      name="phone"
                                      value={phone}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} style={{ margin: '10px 0' }}>
                                  <Typography variant="headline" className="card-header_title">
                                    {i18n.red.explorationInfo}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.name}</InputLabel>
                                    <Input
                                      name="explorationName"
                                      value={explorationName}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.number}</InputLabel>
                                    <Input
                                      name="explorationNumber"
                                      value={explorationNumber}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.species}</InputLabel>
                                    <Input
                                      name="species"
                                      value={species}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.parcelNumber}</InputLabel>
                                    <Input
                                      name="parcelNumber"
                                      value={parcelNumber}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.address}</InputLabel>
                                    <Input
                                      name="explorationAddress"
                                      value={explorationAddress}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.parish}</InputLabel>
                                    <Input
                                      name="explorationParish"
                                      value={explorationParish}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.county}</InputLabel>
                                    <Input
                                      name="explorationCounty"
                                      value={explorationCounty}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.postalCode}</InputLabel>
                                    <Input
                                      name="explorationPostalCode"
                                      value={explorationPostalCode}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.explorationSystem}</InputLabel>
                                    <Input
                                      name="explorationSystem"
                                      value={explorationSystem}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                  <FormControl fullWidth>
                                    <InputLabel>{i18n.red.explorationProduction}</InputLabel>
                                    <Input
                                      name="explorationProduction"
                                      value={explorationProduction}
                                      onChange={this.handleChange}
                                      type="text"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid container spacing={16} style={{ marginTop: 20 }}>
                                  <Grid item xs={12}>
                                    <FormControlLabel
                                      label={
                                        <Typography variant="subheading">
                                          {i18n.red.addAnimals}
                                        </Typography>
                                      }
                                      labelplacement="start"
                                      control={
                                        <Switch
                                          checked={this.state.addAnimals}
                                          onChange={this.onSwitchValue('addAnimals')}
                                          value="addAnimals"
                                          color="primary"
                                        />
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControlLabel
                                      label={
                                        <Typography variant="subheading">
                                          {i18n.red.addTransfers}
                                        </Typography>
                                      }
                                      labelplacement="start"
                                      control={
                                        <Switch
                                          checked={this.state.addTransfers}
                                          onChange={this.onSwitchValue('addTransfers')}
                                          value="addTransfers"
                                          color="primary"
                                        />
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControlLabel
                                      label={
                                        <Typography variant="subheading">
                                          {i18n.red.addSanitaryEvents}
                                        </Typography>
                                      }
                                      labelplacement="start"
                                      control={
                                        <Switch
                                          checked={this.state.addSanitaryEvents}
                                          onChange={this.onSwitchValue('addSanitaryEvents')}
                                          value="addSanitaryEvents"
                                          color="primary"
                                        />
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  size="medium"
                                  variant="raised"
                                  color="primary"
                                  className="card-button"
                                  type="submit"
                                >
                                  {i18n.red.button.export}
                                </Button>
                              </div>
                            </Fragment>
                          )}
                      </CardContent>
                    </Card>
                  </form>
                )}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default REDPage;
