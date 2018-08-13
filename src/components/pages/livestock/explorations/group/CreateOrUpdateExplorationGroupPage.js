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
import ListExplorationAnimals from '../../../../livestock/animal/ListExplorationAnimals';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import ExplorationValidations from '../../../../../validations/ExplorationValidations';
import AnimalService from '../../../../../services/AnimalService';
import GroupService from '../../../../../services/GroupService';
import PlaceService from '../../../../../services/PlaceService';
import { I18nContext } from '../../../../App';

class CreateOrUpdateExplorationGroupPage extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      isLoading: null,
      serverError: null,
      errors: null,
      animalList: null,
      explorationAnimalList: null,
      animal: '',
      name: '',
      place: '',
      placeList: null,
      query: '',
      columnToQuery: 'name',
      addAnimal: false,
    };
  }

  componentWillMount() {
    const { id, explorationId } = this.props.match.params;
    const placeList = PlaceService.get(null, explorationId, true);
    const explorationAnimalList = AnimalService.get(null, explorationId, true);

    if (id) {
      this.setState({ id, isLoading: true });
      const getGroupResponse = GroupService.get(id, null, true);

      getGroupResponse
        .then(res => {
          this.setState({
            id: res.data.id,
            name: res.data.name ? res.data.name : '',
            place: res.data.place ? res.data.place.id : '',
            animalList: res.data.animals ? res.data.animals : '',
            isLoading: false,
          });
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: true });
        });
    }

    placeList
      .then(res => {
        this.setState({ placeList: res.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });

    explorationAnimalList
      .then(res => {
        this.setState({ explorationAnimalList: res.data });
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
    e.preventDefault();
    const { explorationId } = this.props.match.params;
    this.setState({ isLoading: true });
    const { id, name, place, placeList } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateGroup(name, place, placeList, i18n);
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      if (!id) {
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

  handleRemove = i => {
    const removeAnimalFromGroup = AnimalService.addOrRemoveOfGroup(i, this.state.id, false, true);

    removeAnimalFromGroup
      .then(res => {
        this.setState({
          id: res.data.id,
          name: res.data.name ? res.data.name : '',
          place: res.data.place ? res.data.place.id : '',
          animalList: res.data.animals ? res.data.animals : '',
          isLoading: false,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  handleEdit = i => {
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/animal/${
        this.props.match.params.explorationId
      }/edit/${i}`,
    );
  };

  addAnimalForm = e => {
    this.setState({ addAnimal: true });
  };

  onCancel = e => {
    const { entityId, explorationId } = this.props.match.params;
    this.props.history.push(`/livestock/explorations/${entityId}/group/${explorationId}`);
  };

  onCancelAddAnimal = e => {
    this.setState({ animal: '', addAnimal: false });
  };

  handleAnimalChange = e => {
    this.setState({ animal: e.target.value });
  };

  onAddAnimalToGroup = e => {
    this.setState({ isLoading: true });
    let addAnimalToGroupResponse = AnimalService.addOrRemoveOfGroup(
      this.state.animal,
      this.state.id,
      true,
      true,
    );

    addAnimalToGroupResponse
      .then(res => {
        this.setState({
          id: res.data.id,
          name: res.data.name ? res.data.name : '',
          place: res.data.place ? res.data.place.id : '',
          animalList: res.data.animals ? res.data.animals : '',
          isLoading: false,
          addAnimal: false,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  };

  render() {
    const {
      name,
      place,
      placeList,
      animalList,
      explorationAnimalList,
      addAnimal,
      animal,
      query,
      columnToQuery,
      serverError,
      isLoading,
    } = this.state;
    let renderAnimalList = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <ListExplorationAnimals
            handleRemove={this.handleRemove}
            onEdit={this.handleEdit}
            data={
              query
                ? animalList.filter(
                    item =>
                      columnToQuery !== 'explorationType'
                        ? item[columnToQuery] && item[columnToQuery].toLowerCase().includes(query)
                        : item[columnToQuery].name &&
                          item[columnToQuery].name.toLowerCase().includes(query),
                  )
                : animalList
            }
            i18n={i18n}
            header={[
              {
                name: i18n.exploration.name,
                prop: 'name',
              },
              {
                name: i18n.exploration.animals.number,
                prop: 'number',
              },
              {
                name: i18n.exploration.animals.chipNumber,
                prop: 'chipNumber',
              },
              {
                name: i18n.exploration.animals.animalType,
                prop: 'explorationType',
              },
            ]}
          />
        )}
      </I18nContext.Consumer>
    );
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <Card style={{ marginBottom: 20 }}>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title">
                        {i18n.exploration.groups.group}
                      </Typography>
                    </div>
                    <div className="card-body">
                      <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.name}*</InputLabel>
                        <Input name="name" value={name} onChange={this.handleChange} />
                      </FormControl>
                      {placeList && (
                        <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>{i18n.exploration.place.placeTitle}*</InputLabel>
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
                </Card>
                <Card>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title">
                        {i18n.exploration.animals.animalsTitle}
                      </Typography>
                    </div>
                    <div className="card-body">
                      {animalList && animalList.length > 0
                        ? renderAnimalList
                        : i18n.exploration.groups.noAnimals}
                      {!addAnimal &&
                        explorationAnimalList && (
                          <Button
                            size="large"
                            variant="raised"
                            color="primary"
                            style={{ width: '100%', marginTop: 25 }}
                            onClick={this.addAnimalForm}
                          >
                            {i18n.exploration.groups.addAnimal}
                          </Button>
                        )}
                      {addAnimal && (
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 40,
                            alignItems: 'center',
                          }}
                        >
                          <FormControl
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                          >
                            <InputLabel>Animal*</InputLabel>
                            <Select name="animal" value={animal} onChange={this.handleAnimalChange}>
                              {explorationAnimalList.map(a => {
                                return (
                                  <MenuItem key={a.id} value={a.id}>
                                    {a.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          <div>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              onClick={this.onCancelAddAnimal}
                            >
                              {i18n.exploration.button.cancel}
                            </Button>
                            <Button
                              size="medium"
                              variant="raised"
                              color="primary"
                              className="card-button"
                              onClick={this.onAddAnimalToGroup}
                            >
                              {i18n.exploration.button.save}
                            </Button>
                          </div>
                        </div>
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
                  position: 'absolute',
                }}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default CreateOrUpdateExplorationGroupPage;
