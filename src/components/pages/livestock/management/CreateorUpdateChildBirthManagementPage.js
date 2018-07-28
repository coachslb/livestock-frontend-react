import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import {
  Card,
  FormControl,
  TextField,
  InputLabel,
  Input,
  Select,
  MenuItem,
  CardContent,
  Button,
  CircularProgress,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import AnimalService from '../../../../services/AnimalService';
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementChildBirthService from '../../../../services/ManagementChildBirthService';
import DateUtilsService from '../../../../services/DateUtilsService';

class CreateorUpdateChildBirthManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date().toJSON().slice(0, 10),
      id: null,
      obs: '',
      exploration: '',
      animalType: '',
      female: '',
      male: '',
      childNumber: 0,
      animalFemaleList: null,
      animalMaleList: null,
      animalTypeList: null,
      explorationList: null,
      isLoading: null,
      serverError: null,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId, id } = this.props.match.params;

    this.setState({ id });

    if (id) {
      this.setState({ id });
      const getChildBirthResponse = ManagementChildBirthService.get(id, entityId, true);

      getChildBirthResponse
        .then(res => {
          console.log(res);
          this.setState({
            id: res.data.id,
            obs: res.data.observations || '',
            date: res.data.date
              ? DateUtilsService.formatDate(res.data.date)
              : new Date().toJSON().slice(0, 10),
            exploration:
              res.data.animals !== null && res.data.animals.length > 0
                ? res.data.animals[0].exploration.id
                : '',
            animalType:
              res.data.animals !== null && res.data.animals.length > 0
                ? res.data.animals[0].explorationType.id
                : '',
            female:
              res.data.animals !== null && res.data.animals.length > 0
                ? res.data.animals.find(animal => animal.sex.id === 2).id
                : '',
            male:
              res.data.animals !== null && res.data.animals.length > 0
                ? res.data.animals.find(animal => animal.sex.id === 1)
                  ? res.data.animals.find(animal => animal.sex.id === 1).id
                  : ''
                : '',
            childNumber: res.data.numberOfChilds || '',
            isLoading: false,
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ isLoading: false, serverError: true });
        });
    }

    let animalTypePromise = FixedValuesService.getExplorationTypes(true);
    let explorationsPromise = ExplorationService.get(null, entityId, true);
    let animalMalePromise = AnimalService.getAnimalBySex(1, entityId, 4, true);
    let animalFemalePromise = AnimalService.getAnimalBySex(2, entityId, 4, true);

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data });
    });

    animalTypePromise
      .then(res => {
        this.setState({ animalTypeList: res.data });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    animalMalePromise
      .then(res => {
        this.setState({ animalMaleList: res.data, currentAnimalMaleList: res.data });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    animalFemalePromise
      .then(res => {
        this.setState({
          animalFemaleList: res.data,
          currentAnimalFemaleList: res.data,
          isLoading: false,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleExplorationTypeChange = e => {
    const { animalFemaleList, animalMaleList, exploration } = this.state;
    if (exploration !== null && exploration !== '') {
      this.setState({
        female: '',
        male: '',
        [e.target.name]: e.target.value,
        currentAnimalFemaleList: animalFemaleList
          .filter(animal => animal.explorationType === e.target.value)
          .filter(animal => animal.exploration === exploration),
        currentAnimalMaleList: animalMaleList
          .filter(animal => animal.explorationType === e.target.value)
          .filter(animal => animal.exploration === exploration),
      });
    } else {
      this.setState({
        female: '',
        male: '',
        [e.target.name]: e.target.value,
        currentAnimalFemaleList: animalFemaleList.filter(
          animal => animal.explorationType === e.target.value,
        ),
        currentAnimalMaleList: animalMaleList.filter(
          animal => animal.explorationType === e.target.value,
        ),
      });
    }
  };

  handleExplorationChange = e => {
    const { animalFemaleList, animalMaleList, animalType } = this.state;
    if (animalType !== null && animalType !== '') {
      this.setState({
        female: '',
        male: '',
        [e.target.name]: e.target.value,
        currentAnimalFemaleList: animalFemaleList
          .filter(animal => animal.exploration === e.target.value)
          .filter(animal => animal.explorationType === animalType),
        currentAnimalMaleList: animalMaleList
          .filter(animal => animal.exploration === e.target.value)
          .filter(animal => animal.explorationType === animalType),
      });
    } else {
      this.setState({
        female: '',
        male: '',
        [e.target.name]: e.target.value,
        currentAnimalFemaleList: animalFemaleList.filter(
          animal => animal.exploration === e.target.value,
        ),
        currentAnimalMaleList: animalMaleList.filter(
          animal => animal.exploration === e.target.value,
        ),
      });
    }
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCancel = e => {
    const { entityId } = this.props.match.params;
    this.props.history.push(`/livestock/management/${entityId}`);
  };

  onCreate = e => {
    e.preventDefault();
    const { entityId } = this.props.match.params;
    this.setState({ isLoading: true });
    const {
      id,
      date,
      obs,
      female,
      male,
      childNumber,
      currentAnimalFemaleList,
      currentAnimalMaleList,
      exploration,
    } = this.state;

    if (!id) {
      let createChildBirthResponse = ManagementChildBirthService.create(
        {
          date,
          managementType: 1,
          agricolaEntityId: entityId,
          exploration: exploration,
          observations: obs,
          animals: [female, male].filter(Boolean),
          motherChipNumber:
            female && currentAnimalFemaleList.find(animal => animal.id === female).chipNumber,
          fatherChipNumber:
            male && currentAnimalMaleList.find(animal => animal.id === male).chipNumber,
          numberOfChilds: childNumber,
        },
        true,
      );

      createChildBirthResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let updateChildBirthResponse = ManagementChildBirthService.update(
        {
          id,
          date,
          managementType: 1,
          agricolaEntityId: entityId,
          exploration: exploration,
          observations: obs,
          animals: [female, male].filter(Boolean),
          motherChipNumber:
            female && currentAnimalFemaleList.find(animal => animal.id === female).chipNumber,
          fatherChipNumber:
            male && currentAnimalMaleList.find(animal => animal.id === male).chipNumber,
          numberOfChilds: childNumber,
        },
        true,
      );

      updateChildBirthResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });
    }
  };

  render() {
    const { entityId } = this.props.match.params;
    const {
      date,
      currentAnimalFemaleList,
      currentAnimalMaleList,
      explorationList,
      animalTypeList,
      exploration,
      animalType,
      female,
      male,
      obs,
      childNumber,
      serverError,
      isLoading,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Parto" />
            <Card style={{ marginTop: 20 }}>
              <CardContent>
                <div className="card-body">
                  <FormControl style={{ width: '28%', margin: '10px', marginBottom: '40px' }}>
                    <TextField
                      type="date"
                      label="Data"
                      name="date"
                      value={date}
                      required
                      onChange={this.handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                  {animalTypeList && (
                    <FormControl style={{ width: '30%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel required>Tipo de animal</InputLabel>
                      <Select
                        name="animalType"
                        value={animalType}
                        onChange={this.handleExplorationTypeChange}
                      >
                        {animalTypeList.map(animalType => {
                          return (
                            <MenuItem key={animalType.id} value={animalType.id}>
                              {animalType.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  {explorationList && (
                    <FormControl style={{ width: '30%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel required>Exploração</InputLabel>
                      <Select
                        name="exploration"
                        value={exploration}
                        onChange={this.handleExplorationChange}
                      >
                        {explorationList.map(exploration => {
                          return (
                            <MenuItem key={exploration.id} value={exploration.id}>
                              {exploration.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  {currentAnimalFemaleList && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel required>Femea</InputLabel>
                      <Select name="female" value={female} onChange={this.handleChange}>
                        {currentAnimalFemaleList.map(animal => {
                          return (
                            <MenuItem key={animal.id} value={animal.id}>
                              {`${animal.number} - ${animal.name ? animal.name : ''} (${
                                animal.chipNumber
                              })`}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  {currentAnimalMaleList && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Macho</InputLabel>
                      <Select name="male" value={male} onChange={this.handleChange}>
                        {currentAnimalMaleList.map(animal => {
                          return (
                            <MenuItem key={animal.id} value={animal.id}>
                              {`${animal.number} - ${animal.name ? animal.name : ''} (${
                                animal.chipNumber ? animal.chipNumber : ''
                              })`}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel required>Quantidade de crias</InputLabel>
                    <Input
                      name="childNumber"
                      type="number"
                      value={childNumber}
                      onChange={this.handleChange}
                    />
                  </FormControl>
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Observações</InputLabel>
                    <Input name="obs" value={obs} onChange={this.handleChange} />
                  </FormControl>
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
                disabled={!female || !date || !animalType || !exploration || !childNumber}
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
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'fixed' }}
          />
        )}
      </Fragment>
    );
  }
}

export default CreateorUpdateChildBirthManagementPage;
