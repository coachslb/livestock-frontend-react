import React, { Component, Fragment } from 'react';
import { FormControl, InputLabel, Typography, Select, MenuItem, CircularProgress } from 'material-ui';
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
      isLoading: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentWillMount() {
    this.setState({isLoading: true});
    //Get Countries List
    let countriesPromise = FixedValuesService.getCountries();
    countriesPromise.then(res => {
      this.setState({ countries: res.data, isLoading: false });
    });
  }

  onSubmitCreateEntity(e) {
    e.preventDefault();
    this.setState({ isLoading: true })
    const {name, country, email} = this.state;
    let errors = EntityValidations.validateCreateEntity(name, country, this.props.i18n);

    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let createEntityResponse = EntityService.createEntity({
        name,
        email,
        country
      }, true);

      createEntityResponse.then((res)=>{
        localStorage.setItem('entityId', res.data.id);
        this.setState({isLoading: false})
        this.props.history.replace('/livestock');
      }).catch((err) => {
        this.setState({ serverError: true, isLoading: false })
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
    const { countries, country, errors, serverError, isLoading } = this.state;
    const { i18n } = this.props;

    return (
      <Fragment>
      {!isLoading && (
        <div className="createEntityForm">
        <Typography variant="headline" className="form-title">
          {i18n.entity.createAgricolaEntity}
        </Typography>
        <form onSubmit={this.onSubmitCreateEntity.bind(this)}>
          <InputField
            style={{ width: '90%', margin: '10px' }}
            name="name"
            onChange={this.onChange}
            required={true}
            label={i18n.entity.name}
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
            <InputLabel required>{i18n.entity.country}</InputLabel>
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
            style={{ marginTop: '50px', width: '20%', marginLeft: '10px' }}
            color="primary"
            variant="raised"
          >
            {i18n.entity.conclude}
          </SubmitButton>
      </form> </div>)}
        {errors && (
          <ErrorDialog
            title={i18n.general.inputErrorTitle}
            text={i18n.general.genericErrorMessage}
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
         {isLoading && <CircularProgress style={{height:'80px', width:'80px', top:"50%", left:"50%", position: 'absolute'}}/>}
        </Fragment>
      
    );
  }
}

export default withRouter(CreateEntity);
