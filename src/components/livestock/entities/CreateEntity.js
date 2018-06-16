import React, { Component } from 'react';
import { FormControl, InputLabel, Typography, Select, MenuItem } from 'material-ui';
import {withRouter} from 'react-router-dom';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import InputField from '../../UI/Inputs/InputField';
import SubmitButton from '../../UI/Buttons/SubmitButton';
import FixedValuesService from '../../../services/FixedValuesService';
import EntityService from '../../../services/EntityService';
import EntityValidations from '../../../validations/EntityValidations';
import '../../pages/livestock/entities/entity.css';

class CreateEntity extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      country: 'Portugal',
      email: '',
      countries: [],
      errors: null,
      serverError: null,
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

  onSubmitCreateEntity(e) {
    e.preventDefault();
    const {name, country, email} = this.state;
    let errors = EntityValidations.validateCreateEntity(name, country);

    if (errors.length > 0) this.setState({ errors });
    else {
      let createEntityResponse = EntityService.createEntity({
        name,
        email,
        country
      }, true);

      createEntityResponse.then((res)=>{
        localStorage.setItem('entityId', res.data.id);
        this.props.history.replace('/livestock');
      }).catch((err) => {
        this.setState({ serverError: true })
      });
      
    }
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

    return (
      <div className="createEntityForm">
        <Typography variant="headline" className="form-title">
          Create Entity
        </Typography>
        <form onSubmit={this.onSubmitCreateEntity.bind(this)}>
          <InputField
            style={{ width: '90%', margin: '10px' }}
            name="name"
            onChange={this.onChange}
            required={true}
            label="Name"
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'name';
              })
            }
          />
          <InputField
            style={{ width: '45%', margin: '10px' }}
            name="email"
            onChange={this.onChange}
            required={false}
            label="E-mail"
            errorMessage={
              errors != null &&
              errors.filter(error => {
                return error[0] === 'email';
              })
            }
          />
          <FormControl style={{ width: '45%', margin: '10px' }}>
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
          <SubmitButton
            style={{ marginTop: '50px', width: '20%', marginLeft: '10px', padding: '15px' }}
            color="primary"
            variant="raised"
          >
            Conclude
          </SubmitButton>
        </form>
        {errors && (
          <ErrorDialog
            title="Input Errors"
            text="There are some input errors"
            errors={errors}
            onDialogClose={this.onDialogClose}
          />
        )}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There is some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
      </div>
    );
  }
}

export default withRouter(CreateEntity);
