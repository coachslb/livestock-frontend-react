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
  CardActions,
  Button,
  CircularProgress,
} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import AnimalService from '../../../../services/AnimalService';

class CreateorUpdateChildBirthManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date().toJSON().slice(0, 10),
      obs: '',
      female: '',
      male: '',
      childNumber: 0,
      animalFemaleList: null,
      animalMaleList: null,
      isLoading: null,
      serverError: null,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { entityId } = this.props.match.params;

    let animalMalePromise = AnimalService.getAnimalBySex(1, entityId, true);
    let animalFemalePromise = AnimalService.getAnimalBySex(2, entityId, true);
    animalMalePromise
      .then(res => {
        this.setState({ animalMaleList: res.data });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));

    animalFemalePromise
      .then(res => {
        this.setState({ animalFemaleList: res.data, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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
    console.log(this.state);
  }

  render() {
    const { entityId } = this.props.match.params;
    const {
      date,
      animalFemaleList,
      animalMaleList,
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
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <TextField
                      type="date"
                      label="Data"
                      name="date"
                      value={date}
                      onChange={this.handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                  {animalFemaleList && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Femea</InputLabel>
                      <Select name="female" value={female} onChange={this.handleChange}>
                        {animalFemaleList.map(animal => {
                          return (
                            <MenuItem key={animal.id} value={animal.id}>
                              {animal.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  {animalMaleList && (
                    <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Macho</InputLabel>
                      <Select name="male" value={male} onChange={this.handleChange}>
                        {animalMaleList.map(animal => {
                          return (
                            <MenuItem key={animal.id} value={animal.id}>
                              {animal.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Quantidade de crias</InputLabel>
                    <Input name="childNumber" value={childNumber} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '45%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Observações</InputLabel>
                    <Input name="obs" value={obs} onChange={this.handleChange} />
                  </FormControl>
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

export default CreateorUpdateChildBirthManagementPage;
