import React, { Component } from 'react';
import FixedValuesService from '../../../services/FixedValuesService';
import { FormControl, InputLabel, Typography, Select, MenuItem, CircularProgress } from 'material-ui';
import RegistrationValidations from '../../../validations/RegistrationValidations';
import RegistrationService from '../../../services/RegistrationService';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import {withRouter} from 'react-router-dom';
import '../../pages/accounts/accounts.css';

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      country: 'Portugal',
      phone: '',
      email: '',
      password: '',
      repeatPassword: '',
      terms: false,
      newsletter: false,
      errors: null,
      serverError: null,
      countries: [],
      isLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentWillMount() {
    //Get Countries List
    this.setState({ isLoading: true });
    let countriesPromise = FixedValuesService.getCountries();
    countriesPromise.then(res => {
      this.setState({ countries: res.data, isLoading: false });
    });
  }

  onSubmitRegistration(e) {
    this.setState({ isLoading: true })
    let errors = RegistrationValidations.validateRegistration(this.state, this.props.i18n);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      const { email, password, name, phone, country } = this.state;

      let registrationResponse = RegistrationService.registration({
        email,
        password,
        //todo language prop from page
        lang: this.props.language,
        username: name,
        phoneNumber: phone,
        country,
      }, false);

      registrationResponse.then((res)=>{
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('deviceToken', res.data.deviceToken);
        localStorage.setItem('language', res.data.language.code);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        let expirationDate = new Date().getTime() + 900000
        localStorage.setItem('expirationDate', expirationDate);
        this.setState({isLoading: false});
        //create entity page
        this.props.history.push('/create-entity')
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: false })
      });
      
    }

    e.preventDefault();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  render() {
    const { countries, country, errors, serverError, isLoading } = this.state;
    const { i18n } = this.props;

    let render = (
      <div className="registrationForm">
        <Typography variant="headline" className="form-title">
          {i18n.registration.createUser}
        </Typography>
        <form onSubmit={this.onSubmitRegistration.bind(this)}>
          <InputField
            style={{ width: '60%', margin: '10px' }}
            name="name"
            onChange={this.onChange}
            required={true}
            label={i18n.registration.name}
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'name';
            })}
          />
          <FormControl style={{ width: '30%', margin: '10px' }}>
            <InputLabel required>{i18n.registration.country}</InputLabel>
            <Select
              name="country"
              value={country !== '' ? country : 'Portugal'}
              onChange={this.onChange}
            >
              {countries.map(country => {
                return (
                  <MenuItem key={country.name} value={country.name}>
                    {country.name + ' (' + country.indicative + ')'}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <InputField
            style={{ width: '30%', margin: '10px' }}
            name="phone"
            onChange={this.onChange}
            required={true}
            label={i18n.registration.phone}
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'phone';
            })}
          />
          <InputField
            style={{ width: '60%', margin: '10px' }}
            name="email"
            onChange={this.onChange}
            required={true}
            label="E-mail"
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'email';
            })}
          />
          <InputField
            style={{ width: '45%', margin: '10px' }}
            name="password"
            onChange={this.onChange}
            required={true}
            label={i18n.registration.password}
            type="password"
            errorMessage={errors != null && errors.filter(error => {
              console.log(error[0])
              return error[0] === 'password';
            })}
          />
          <InputField
            style={{ width: '45%', margin: '10px' }}
            name="repeatPassword"
            onChange={this.onChange}
            required={true}
            label={i18n.registration.repeatPassword}
            type="password"
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'password';
            })}
          />
          <SubmitButton
            style={{ marginTop: '50px', width: '20%', marginLeft: '10px' }}
            color="primary"
            variant="raised"
          >
            {i18n.registration.next}
            <i className="material-icons">arrow_forward</i>
          </SubmitButton>
        </form>
        {errors && (
          <ErrorDialog
            title={i18n.registration.errorTitle}
            text={i18n.registration.errorMessage}
            errors={errors}
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
        { isLoading && (
          <CircularProgress />
        )}
      </div>
    );
    return render;
  }
}

export default withRouter(Registration);
