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
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import FixedValuesService from '../../../../../services/FixedValuesService';
import ExplorationValidations from '../../../../../validations/ExplorationValidations';
import PlaceService from '../../../../../services/PlaceService';
import MapDraw from '../../../../UI/MapDraw';
import { I18nContext } from '../../../../App';

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
      polygons: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    const getPlaceTypes = FixedValuesService.getPlaceTypes(true);
    const getSoilTypes = FixedValuesService.getSoilTypes(true);

    if (id) {
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
            polygons: res.data.polygons ? res.data.polygons : [],
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

  onCreate = (e, i18n) => {
    //falta a parte do mapa
    e.preventDefault();
    const { explorationId } = this.props.match.params;
    this.setState({ isLoading: true });
    const {
      id,
      name,
      number,
      placeType,
      soilType,
      placeTypes,
      soilTypes,
      area,
      polygons,
    } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdatePlace(
      name,
      number,
      placeType,
      placeTypes,
      soilType,
      soilTypes,
      area,
      polygons,
      i18n,
    );
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      if (!id) {
        let createPlaceResponse = PlaceService.createPlace(
          {
            id,
            name,
            number,
            placeType,
            soilType,
            area,
            polygons,
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
      } else {
        let updatePlaceResponse = PlaceService.updatePlace(
          {
            id,
            name,
            number,
            placeType,
            soilType,
            area,
            polygons,
            areaUnit: 'ha',
            exploration: explorationId,
          },
          true,
        );

        updatePlaceResponse
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
    }
  };

  onCancel = e => {
    const { entityId, explorationId } = this.props.match.params;
    this.props.history.push(`/livestock/explorations/${entityId}/place/${explorationId}`);
  };

  handlePolygons = (polygons, area) => {
    this.setState({ polygons, area });
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
      polygons,
      soilType,
      soilTypes,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <Card>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title">
                        {i18n.exploration.place.placeTitle}
                      </Typography>
                    </div>
                    <div className="card-body">
                      <FormControl style={{ width: '40%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.name}*</InputLabel>
                        <Input name="name" value={name} onChange={this.handleChange} />
                      </FormControl>
                      <FormControl style={{ width: '10%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.place.number}*</InputLabel>
                        <Input name="number" value={number} onChange={this.handleChange} />
                      </FormControl>
                      {placeTypes && (
                        <FormControl style={{ width: '40%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel htmlFor="select-multiple-checkbox">
                            {i18n.exploration.place.placeType}*
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
                      <MapDraw
                      //TODO
                        language="pt-PT"
                        style={{ width: '100%', height: '300px' }}
                        polygons={polygons}
                        onChangePolygons={this.handlePolygons}
                        i18n={{
                          area: i18n.exploration.place.area,
                          totalArea: i18n.exploration.place.totalArea,
                          delete: i18n.exploration.place.delete,
                          deleteAll: i18n.exploration.place.deleteAll,
                        }}
                      />
                      <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.place.area} (ha)</InputLabel>
                        <Input name="area" value={area} onChange={this.handleChange} />
                      </FormControl>
                      {soilTypes && (
                        <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>{i18n.exploration.place.soilType}</InputLabel>
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
                    {i18n.exploration.button.cancel}
                  </Button>
                  <Button
                    size="medium"
                    variant="raised"
                    color="primary"
                    className="card-button"
                    onClick={e => this.onCreate(e, i18n)}
                  >
                    {i18n.exploration.button.save}
                  </Button>
                </div>
              </Fragment>
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

export default CreateorUpdateExplorationPlacePage;
