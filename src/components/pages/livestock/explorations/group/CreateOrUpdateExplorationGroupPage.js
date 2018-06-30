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
  CardActions,
} from 'material-ui';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import ExplorationValidations from '../../../../../validations/ExplorationValidations';
import GroupService from '../../../../../services/GroupService';
import PlaceService from '../../../../../services/PlaceService';

class CreateOrUpdateExplorationGroupPage extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      isLoading: null,
      serverError: null,
      errors: null,
      name: '',
      place: '',
      placeList: null,
    };
  }

  componentDidMount() {
    const { id, explorationId } = this.props.match.params;
    const placeList = PlaceService.get(null, explorationId, true);

    if (id) {
      this.setState({ id, isLoading: true });
      const getGroupResponse = GroupService.get(id, null, true);

      getGroupResponse
        .then(res => {
          this.setState({
            id: res.data.id,
            name: res.data.name ? res.data.name : '',
            place: res.data.places ? res.data.places[0].id : '',
            isLoading: false,
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ isLoading: false, serverError: true });
        });
    }

    placeList
      .then(res => {
        this.setState({ placeList: res.data });
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
    e.preventDefault();
    const { explorationId } = this.props.match.params;
    this.setState({ isLoading: true });
    const { id, name, place, placeList } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateGroup(name, place, placeList);
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      if (id) {
        let createGroupResponse = GroupService.createGroup(
          {
            id,
            name,
            place,
            exploration: explorationId,
          },
          true,
        );

        createGroupResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(
              `/livestock/explorations/${this.props.match.params.entityId}/group/${
                this.props.match.params.explorationId
              }`,
            );
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      } else {
        let updateGroupResponse = GroupService.updateGroup(
          {
            id,
            name,
            place,
            exploration: explorationId,
          },
          true,
        );

        updateGroupResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(
              `/livestock/explorations/${this.props.match.params.entityId}/group/${
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
    this.props.history.push(`/livestock/explorations/${entityId}/group/${explorationId}`);
  };

  render() {
    const { name, place, placeList, serverError, isLoading } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <Card>
              <CardContent>
                <div className="card-header">
                  <Typography variant="headline" className="card-header_title">
                    Grupo
                  </Typography>
                </div>
                <div className="card-body">
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Nome*</InputLabel>
                    <Input name="name" value={name} onChange={this.handleChange} />
                  </FormControl>
                  {placeList && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Local*</InputLabel>
                      <Select name="place" value={place} onChange={this.handleChange}>
                        {placeList.map(place => {
                          return (
                            <MenuItem key={place.id} value={place.id}>
                              {place.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </CardContent>
              <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              </CardActions>
            </Card>
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

export default CreateOrUpdateExplorationGroupPage;
