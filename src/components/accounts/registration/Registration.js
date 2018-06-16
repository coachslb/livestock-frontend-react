import React, { Component } from 'react';
import FixedValuesService from '../../../services/FixedValuesService';
import { FormControl, InputLabel, Typography, Select, MenuItem } from 'material-ui';
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
    };

    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentWillMount() {
    //Get Countries List
    let countriesPromise = FixedValuesService.getCountries();
    countriesPromise.then(res => {
      this.setState({ countries: res.data });
    });
  }

  onSubmitRegistration(e) {
    //do axios request to forgot password attempt
    //receive the response
    let errors = RegistrationValidations.validateRegistration(this.state);

    if (errors.length > 0) this.setState({ errors });
    else {
      const { email, password, name, phone, country } = this.state;

      let registrationResponse = RegistrationService.registration({
        email,
        password,
        //todo language prop from page
        lang: 'pt-PT',
        username: name,
        phoneNumber: phone,
        country,
      }, false);

      registrationResponse.then((res)=>{
        console.log(res);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('deviceToken', res.data.deviceToken);
        localStorage.setItem('language', res.data.language.code);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        let expirationDate = new Date().getTime() + 900000
        localStorage.setItem('expirationDate', expirationDate);
        //create entity page
        this.props.history.push('/create-entity')
      }).catch((err) => {
        this.setState({ serverError: true })
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
    const { countries, country, errors, serverError } = this.state;

    let render = (
      <div className="registrationForm">
        <Typography variant="headline" className="form-title">
          Criar Utilizador
        </Typography>
        <form onSubmit={this.onSubmitRegistration.bind(this)}>
          <InputField
            style={{ width: '60%', margin: '10px' }}
            name="name"
            onChange={this.onChange}
            required={true}
            label="Name"
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'name';
            })}
          />
          <FormControl style={{ width: '30%', margin: '10px' }}>
            <InputLabel required>Country</InputLabel>
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
            label="Phone Number"
            errorMessage={errors != null && errors.filter(error => {
              return error[0] === 'phone';
            })}
          />
          <InputField
            style={{ width: '60%', margin: '10px' }}
            name="email"
            onChange={this.onChange}
            required={false}
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
            label="Password"
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
            label="Repeat password"
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
            Next
            <i className="material-icons">arrow_forward</i>
          </SubmitButton>
        </form>
        {errors && (
          <ErrorDialog
            title="Registration Error"
            text="There are some input errors"
            errors={errors}
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
      </div>
    );
    return render;
  }
}

export default withRouter(Registration);
