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
  Grid,
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
      cropType: '',
      cropTypes: null,
      area: 0,
      polygons: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    const getPlaceTypes = FixedValuesService.getPlaceTypes(true);
    const getCropTypes = FixedValuesService.getCropTypes(true);

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
            cropType: res.data.crop ? res.data.crop.id : '',
            area: res.data.area ? res.data.area : 0,
            polygons: res.data.polygons ? res.data.polygons : [],
            isLoading: false,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    getPlaceTypes
      .then(res => {
        this.setState({ placeTypes: res.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });

    getCropTypes
      .then(res => {
        this.setState({ cropTypes: res.data, isLoading: false });
      })
      .catch(err => {
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
      cropType,
      placeTypes,
      cropTypes,
      area,
      polygons,
    } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdatePlace(
      name,
      number,
      placeType,
      placeTypes,
      cropType,
      cropTypes,
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
            crop: cropType,
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
            crop: cropType,
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
      cropType,
      cropTypes,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n, language }) => (
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
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>{i18n.exploration.name}*</InputLabel>
                          <Input name="name" value={name} onChange={this.handleChange} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl fullWidth>
                          <InputLabel>{i18n.exploration.place.number}*</InputLabel>
                          <Input name="number" value={number} onChange={this.handleChange} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {placeTypes && (
                          <FormControl fullWidth>
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
                      </Grid>
                      <Grid item xs={12}>
                        <MapDraw
                          //TODO
                          language={language}
                          style={{ height: '450px' }}
                          polygons={polygons}
                          onChangePolygons={this.handlePolygons}
                          i18n={{
                            area: i18n.exploration.place.area,
                            totalArea: i18n.exploration.place.totalArea,
                            delete: i18n.exploration.place.delete,
                            deleteAll: i18n.exploration.place.deleteAll,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>{i18n.exploration.place.area} (ha)</InputLabel>
                          <Input name="area" value={area} onChange={this.handleChange} />
                        </FormControl>
                      </Grid>
                      {placeType === '' ||
                        (placeType === 1 && (
                          <Grid item xs={6}>
                            {cropTypes && (
                              <FormControl fullWidth>
                                <InputLabel>{i18n.exploration.place.cropType}</InputLabel>
                                <Select
                                  name="cropType"
                                  value={cropType}
                                  onChange={this.handleChange}
                                >
                                  {cropTypes.map(cropType => {
                                    return (
                                      <MenuItem key={cropType.id} value={cropType.id}>
                                        {cropType.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            )}
                          </Grid>
                        ))}
                    </Grid>
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
