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
} from 'material-ui';
import SelectForm from '../../../UI/Inputs/SelectForm';
import InputForm from '../../../UI/Inputs/InputForm';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../App';
import ExplorationService from '../../../../services/ExplorationService';

class REDPage extends Component {
  constructor() {
    super();
    this.state = {
      exploration: null,
      explorationList: null,
      serverError: null,
      isLoading: null,
      addAnimals: false,
      addTransfers: false,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const entityId = localStorage.getItem('entityId');

    const explorationsPromise = ExplorationService.get(null, entityId, true);

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data, isLoading: false });
    });
  }

  onSwitchValue = name => event => {
    console.log(name, event.target.checked);
    this.setState({ [name]: event.target.checked });
  };

  onSubmit = async values => {
    this.setState({ isLoading: true });
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const { isLoading, serverError, explorationList } = this.state;

    console.log(this.state);
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
                validate={this.validate}
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
                          <Typography
                            variant="headline"
                            className="card-header_title"
                            color="primary"
                          >
                            {i18n.red.title}
                          </Typography>
                          {explorationList && (
                            <SelectForm
                              label={i18n.red.exploration}
                              name="exploration"
                              required={true}
                              list={explorationList}
                              style={{
                                width: '45%',
                                margin: '10px',
                                marginBottom: '40px',
                              }}
                            />
                          )}
                        </div>
                        {explorationList &&
                          values.exploration && (
                            <Fragment>
                              <Grid container spacing={16} style={{ marginBottom: 20 }}>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.year}
                                    name="year"
                                    required={true}
                                    fullWidth={true}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.name}
                                    name="name"
                                    required={true}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label="NIF"
                                    name="nif"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.np}
                                    name="np"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <InputForm
                                    label={i18n.red.address}
                                    name="userAddress"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.brand}
                                    name="brand"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.phone}
                                    name="phone"
                                    required={false}
                                    fullWidth={true}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item xs={12} style={{ margin: '10px 0' }}>
                                  <Typography variant="headline" className="card-header_title">
                                    {i18n.red.explorationInfo}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <InputForm
                                    label={i18n.red.name}
                                    name="explorationName"
                                    required={true}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.number}
                                    name="explorationNumber"
                                    required={true}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.parcelNumber}
                                    name="explorationType"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <InputForm
                                    label={i18n.red.address}
                                    name="explorationAddress"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.parish}
                                    name="explorationParish"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.county}
                                    name="parcelCounty"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.postalCode}
                                    name="explorationPostalCode"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.parcelNumber}
                                    name="explorationType"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.explorationSystem}
                                    name="explorationSystem"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <InputForm
                                    label={i18n.red.explorationProduction}
                                    name="explorationProduction"
                                    required={false}
                                    fullWidth={true}
                                    type="text"
                                  />
                                </Grid>
                                <Grid container spacing={16} style={{ marginTop: 20 }}>
                                <Grid item xs={12}>
                                  <FormControlLabel
                                    label={<Typography variant="subheading">{i18n.red.addAnimals}</Typography>}
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
                                      label={<Typography variant="subheading">{i18n.red.addTransfers}</Typography>}
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
                                </Grid>
                              </Grid>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  size="medium"
                                  variant="raised"
                                  color="primary"
                                  className="card-button"
                                  type="submit"
                                  disabled={invalid || pristine}
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
