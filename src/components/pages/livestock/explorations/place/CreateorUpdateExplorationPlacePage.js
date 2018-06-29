import React, { Fragment, Component } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Input,
  InputLabel,
  Select,
  Button,
  MenuItem,
  CircularProgress,
} from 'material-ui';
import TerrainPolygon from '../../../../utils/TerrainPolygon';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import FixedValuesService from '../../../../../services/FixedValuesService';
import ExplorationValidations from '../../../../../validations/ExplorationValidations';
import PlaceService from '../../../../../services/PlaceService';

class CreateorUpdateExplorationPlacePage extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      isLoading: null,
      serverError: null,
      name: '',
      number: '',
      placeType: '',
      placeTypes: null,
      soilType: '',
      soilTypes: null,
      area: 0,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;
    console.log(id);

    const getPlaceTypes = FixedValuesService.getPlaceTypes(true);
    const getSoilTypes = FixedValuesService.getSoilTypes(true);

    if (id) {
      console.log('Hello')
      this.setState({ id });
      const getPlaceResponse = PlaceService.get(id, null, true);

      getPlaceResponse
        .then(res => {
          this.setState({
            id: res.data.id,
            name: res.data.name ? res.data.name : '',
            number: res.data.number ? res.data.number : '',
            placeType: res.data.placeType ? res.data.placeType.id : '',
            soilType: res.data.soilType ? res.data.soilType.id : '',
            area: res.data.area ? res.data.area : 0,
            isLoading: false,
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ isLoading: false, serverError: true });
        });
    }

    getPlaceTypes
      .then(res => {
        this.setState({ placeTypes: res.data });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false, serverError: true });
      });

    getSoilTypes
      .then(res => {
        this.setState({ soilTypes: res.data, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false, serverError: true });
      });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCreate = e => {
    //falta a parte do mapa
    e.preventDefault();
    const { explorationId } = this.props.match.params;
    this.setState({ isLoading: true });
    const { id, name, number, placeType, soilType, placeTypes, soilTypes, area } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdatePlace(
      name,
      number,
      placeType,
      placeTypes,
      soilType,
      soilTypes,
      area,
    );
    console.log(errors);
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      let createPlaceResponse = PlaceService.createPlace(
        {
          id,
          name,
          number,
          placeType,
          soilType,
          area,
          areaUnit: 'ha',
          exploration: explorationId,
        },
        true,
      );

      createPlaceResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(
            `/livestock/explorations/${this.props.match.params.entityId}/place/${
              this.props.match.params.explorationId
            }`,
          );
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  onCancel = e => {
    console.log(this.props)
    const { entityId, explorationId } = this.props.match.params;
    this.props.history.push(`/livestock/explorations/${entityId}/place/${explorationId}`);
  };

  render() {
    const {
      placeTypes,
      name,
      number,
      placeType,
      serverError,
      isLoading,
      area,
      soilType,
      soilTypes,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <Card>
              <CardContent>
                <div className="card-header">
                  <Typography variant="headline" className="card-header_title">
                    Local
                  </Typography>
                </div>
                <div className="card-body">
                  <FormControl style={{ width: '40%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Nome*</InputLabel>
                    <Input name="name" value={name} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '10%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Número*</InputLabel>
                    <Input name="number" value={number} onChange={this.handleChange} />
                  </FormControl>
                  {placeTypes && (
                    <FormControl style={{ width: '40%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel htmlFor="select-multiple-checkbox">
                        Tipo de exploração*
                      </InputLabel>
                      <Select name="placeType" value={placeType} onChange={this.handleChange}>
                        {placeTypes.map(place => {
                          return (
                            <MenuItem key={place.id} value={place.id}>
                              {place.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  <TerrainPolygon />
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Área (ha)</InputLabel>
                    <Input name="area" value={area} onChange={this.handleChange} />
                  </FormControl>
                  {soilTypes && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Tipo de solo</InputLabel>
                      <Select name="soilType" value={soilType} onChange={this.handleChange}>
                        {soilTypes.map(soilType => {
                          return (
                            <MenuItem key={soilType.id} value={soilType.id}>
                              {soilType.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </CardContent>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="medium"
                variant="raised"
                color="primary"
                className="card-button"
                onClick={this.onCancel}
              >
                Cancelar
              </Button>
              <Button
                size="medium"
                variant="raised"
                color="primary"
                className="card-button"
                onClick={this.onCreate}
              >
                Guardar
              </Button>
            </div>
          </Fragment>
        )}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default CreateorUpdateExplorationPlacePage;
