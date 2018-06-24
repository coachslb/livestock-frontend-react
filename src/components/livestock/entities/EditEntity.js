import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  CircularProgress
} from 'material-ui';
import '../../pages/livestock/entities/entity.css';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import FixedValuesService from '../../../services/FixedValuesService';
import EntityService from '../../../services/EntityService';

class EditEntity extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      name: '',
      nif: '',
      email: '',
      phone: '',
      detail: '',
      postalCode: '',
      district: '',
      addressId: null,
      country: 'Portugal',
      drap: '',
      drapName: '',
      nifap: '',
      countries: [],
      regions: [],
      manager: null,
      isLoading: false,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  componentWillMount() {
    const entity = this.props.entityData;
    this.setState({
      id: entity.id,
      name: entity.name,
      nif: entity.nif,
      email: entity.email,
      phone: entity.phone,
      detail: entity.address.detail,
      postalCode: entity.address.postalCode,
      district: entity.address.district,
      addressId: entity.address.id,
      country: entity.country.name,
      drapName: entity.region.name,
      drap: entity.region.id,
      nifap: entity.nifap,
      manager: entity.workers[0].id,
      isLoading: true,
    });

    //countries
    let countriesPromise = FixedValuesService.getCountries();
    countriesPromise
      .then(res => {
        this.setState({ countries: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });

    if (entity.country.name === 'Portugal') {
      this.setState({ isLoading: true });
      let drapPromise = FixedValuesService.getRegions(this.state.country);
      drapPromise
        .then(res => {
          this.setState({ regions: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'country') {
      if (this.state.country === 'Portugal') {
        this.setState({ isLoading: true });
        let drapPromise = FixedValuesService.getRegions(this.state.country);
        drapPromise
          .then(res => {
            this.setState({ regions: res.data, isLoading: false });
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      }
    }
    e.preventDefault();
  };

  onSave = e => {
    this.setState({ isLoading: true });
    const {
      id,
      name,
      nif,
      email,
      phone,
      detail,
      postalCode,
      district,
      addressId,
      country,
      drap,
      nifap,
      manager,
    } = this.state;

    let updateEntityPromise = EntityService.updateEntity(
      {
        id,
        name,
        nif,
        email,
        address: {
          id: addressId,
          detail,
          district,
          postalCode,
        },
        phone,
        region: drap,
        country,
        nifap,
        manager,
      },
      true,
    );
    updateEntityPromise
      .then(res => {
        this.setState({ isLoading: false });
        this.props.onCancel();
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  };

  onDialogClose(e) {
    this.setState({ serverError: null });
  }

  render() {
    const { countries, country, regions, drap, isLoading, serverError } = this.state;
    return (
      <Fragment>
        {!isLoading &&
        <Card>
          <CardContent>
            <div className="card-header">
              <Typography variant="headline" className="card-header_title">
                Empresa agrícola
              </Typography>
            </div>
            <div className="card-body">
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>Name</InputLabel>
                <Input
                  name="name"
                  value={this.state.name ? this.state.name : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>NIF</InputLabel>
                <Input
                  name="nif"
                  value={this.state.nif ? this.state.nif : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>E-mail</InputLabel>
                <Input
                  name="email"
                  value={this.state.email ? this.state.email : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>Contacto</InputLabel>
                <Input
                  name="phone"
                  value={this.state.phone ? this.state.phone : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>Morada</InputLabel>
                <Input
                  name="detail"
                  value={this.state.detail ? this.state.detail : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>Código Postal</InputLabel>
                <Input
                  name="postalCode"
                  value={this.state.postalCode ? this.state.postalCode : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>Distrito</InputLabel>
                <Input
                  name="district"
                  value={this.state.district ? this.state.district : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>País</InputLabel>
                <Select
                  name="country"
                  value={country !== '' ? country : 'Portugal'}
                  onChange={this.handleChange}
                >
                  {countries.map(country => {
                    return (
                      <MenuItem key={country.name} value={country.name}>
                        {country.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="card-header">
              <Typography variant="headline" className="card-header_title">
                Dados agrícolas
              </Typography>
            </div>
            <div className="card-body">
              {country &&
                country === 'Portugal' &&
                regions && (
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>DRAP</InputLabel>
                    <Select name="drap" value={drap} onChange={this.handleChange}>
                      {regions.map(region => {
                        return (
                          <MenuItem key={region.id} value={region.id}>
                            {region.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                <InputLabel>NIFAP</InputLabel>
                <Input
                  name="nifap"
                  value={this.state.nifap ? this.state.nifap : ''}
                  onChange={this.handleChange}
                />
              </FormControl>
            </div>
          </CardContent>
          <div className="card-actions">
            <Button
              size="medium"
              variant="raised"
              color="primary"
              className="card-button"
              onClick={this.props.onCancel}
            >
              Cancelar
            </Button>
            <Button
              size="medium"
              variant="raised"
              color="primary"
              className="card-button"
              onClick={this.onSave}
            >
              Guardar
            </Button>
          </div>
        </Card>}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && <CircularProgress style={{height:'80px', width:'80px', top:"50%", left:"50%", position: 'absolute'}}/>}
      </Fragment>
    );
  }
}

export default withRouter(EditEntity);
