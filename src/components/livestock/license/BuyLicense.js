import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import InputForm from '../../UI/Inputs/InputForm';
import {
  Dialog,
  Card,
  CardContent,
  Typography,
  Button,
  Slide,
  CircularProgress,
} from 'material-ui';
import { I18nContext } from '../../App';
import LicenseService from '../../../services/LicenseService';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class BuyLicense extends Component {
  state = {
    newLicense: true,
    price: this.props.basePrice,
    serverError: null,
    isLoading: null,
  };

  handleNumberOfMonthsChange = async values => {
    this.setState({ price: this.props.basePrice * values.numberOfMonths });
  };

  handleCloseDialog = e => {
    this.setState({ newLicense: false });
    this.props.handleCloseDialog(e);
  };

  mapLicenseType = (licenseType, i18n) => {
    switch (licenseType) {
      case 1:
        return i18n.license.freePlan;
      case 2:
        return i18n.license.basePlan;
      default:
        return i18n.license.premiumPlan;
    }
  };

  onSubmit = async values => {
    this.setState({ isLoading: true });
    values.price = this.state.price;
    const entityId = localStorage.getItem('entityId');
    const workerId = localStorage.getItem('workerId');

    console.log(values)
    if (values.numberOfMonths > 0) {
      console.log('Hello')
      values.agricolaEntityId = entityId;
      values.licenseType = this.props.licenseType;
      const createNewLicenseResponse = LicenseService.createLicense(values, true);

      createNewLicenseResponse
        .then(res => {
          this.setState({ isLoading: false, newLicense: false });
          this.props.history.replace(`/livestock/users/${entityId}/license/${workerId}`);
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true, newLicense: false });
          this.props.handleCloseDialog();
        });
    }else{
      this.setState({ isLoading: false });
    }
  };

  validate = values => {
    this.handleNumberOfMonthsChange(values);
    const errors = {};
    return errors;
  };

  render() {
    const { newLicense, price, isLoading, serverError } = this.state;
    const { name, nif } = this.props;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
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
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {!isLoading && (
              <Dialog
                open={newLicense}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleCloseDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <Form
                  onSubmit={this.onSubmit}
                  mutators={{
                    ...arrayMutators,
                  }}
                  initialValues={{
                    numberOfMonths: 1,
                    price: this.props.basePrice,
                    buyerNIF: nif,
                    buyerName: name,
                  }}
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
                            <Typography variant="headline" className="card-header_title">
                              {this.mapLicenseType(this.props.licenseType, i18n)}
                            </Typography>
                          </div>
                          <div className="card-body">
                            <InputForm
                              label={i18n.license.name}
                              name="buyerName"
                              required={false}
                              type="text"
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                            <InputForm
                              label="NIF"
                              name="buyerNIF"
                              required={false}
                              type="text"
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                            <InputForm
                              name="numberOfMonths"
                              required={true}
                              type="number"
                              label={i18n.license.numberOfMonths}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              onChange={this.handleNumberOfMonthsChange.bind(this, values)}
                            />
                            <InputForm
                              name="price"
                              required={true}
                              value={price}
                              type="text"
                              disabled={true}
                              inputAdornment="€"
                              label={i18n.license.price}
                              style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              onClick={this.handleCloseDialog}
                            >
                              {i18n.task.cancel}
                            </Button>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              type="submit"
                              disabled={invalid || pristine}
                            >
                              {i18n.task.save}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </form>
                  )}
                />
              </Dialog>
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default BuyLicense;
