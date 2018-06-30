import React, { Fragment, Component } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  TextField,
  Input,
  InputLabel,
  Select,
  Button,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
} from 'material-ui';
import ErrorDialog from '../../../../UI/ErrorDialog/ErrorDialog';
import FixedValuesService from '../../../../../services/FixedValuesService';
import ExplorationValidations from '../../../../../validations/ExplorationValidations';
import AnimalService from '../../../../../services/AnimalService';
import { CardActions } from '@material-ui/core';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class CreateOrUpdateExplorationAnimalPage extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      isLoading: null,
      serverError: null,
      errors: null,
      name: '',
      number: '',
      chipNumber: '',
      animalTypes: null,
      animalType: '',
      sexList: null,
      sex: '',
      birthDate: '',
      breed: '',
      gestationPeriod: '',
      reproductionAge: '',
      reproductionWeight: '',
      motherNumber: '',
      motherName: '',
      fatherNumber: '',
      fatherName: '',
      bloodType: '',
      groupList: null,
      group: '',
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    const { explorationId } = this.props.match.params;

    const animalTypesResponse = FixedValuesService.getAnimalTypes(explorationId, true);
    const animalSexResponse = FixedValuesService.getSexTypes(true);
    /* const GroupResponse = GroupService.getExplorationGroups(explorationId, true); */

    animalTypesResponse
      .then(res => {
        this.setState({ animalTypes: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true });
      });

    animalSexResponse
      .then(res => {
        this.setState({ sexList: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDialogClose = e => {
    this.setState({ serverError: null, errors: null });
  };

  onCreate = e => {
    e.preventDefault();
    const { explorationId } = this.props.match.params;
    this.setState({ isLoading: true });
    const {
      id,
      name,
      number,
      chipNumber,
      animalType,
      animalTypes,
      sex,
      sexList,
      birthDate,
      breed,
      motherNumber,
      motherName,
      fatherNumber,
      fatherName,
      bloodType,
    } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateAnimal(
      name,
      chipNumber,
      animalType,
      animalTypes,
      sex,
      sexList,
      birthDate,
    );
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      if (id) {
        let createAnimalResponse = AnimalService.createAnimal(
          {
            id,
            name,
            number,
            chipNumber,
            explorationType: animalType,
            sex,
            birthDate,
            breed,
            motherNumber,
            motherName,
            fatherNumber,
            fatherName,
            bloodType,
            exploration: explorationId,
          },
          true,
        );

        createAnimalResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(
              `/livestock/explorations/${this.props.match.params.entityId}/animal/${
                this.props.match.params.explorationId
              }`,
            );
          })
          .catch(err => {
            this.setState({ serverError: true, isLoading: false });
          });
      } else {
        let updateAnimalResponse = AnimalService.updateAnimal(
          {
            id,
            name,
            number,
            chipNumber,
            explorationType: animalType,
            sex,
            birthDate,
            breed,
            motherNumber,
            motherName,
            fatherNumber,
            fatherName,
            bloodType,
            exploration: explorationId,
          },
          true,
        );

        updateAnimalResponse
          .then(res => {
            this.setState({ isLoading: false });
            this.props.history.push(
              `/livestock/explorations/${this.props.match.params.entityId}/animal/${
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
    this.props.history.push(`/livestock/explorations/${entityId}/animal/${explorationId}`);
  };

  getNewDate = e => {
    const date = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/');
    return date;
  };

  render() {
    const {
      isLoading,
      serverError,
      errors,
      name,
      number,
      chipNumber,
      animalType,
      animalTypes,
      sex,
      sexList,
      birthDate,
      breed,
      gestationPeriod,
      reproductionAge,
      reproductionWeight,
      motherName,
      motherNumber,
      fatherName,
      fatherNumber,
      bloodType,
      groupList,
      group,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <Card>
              <CardContent>
                <div className="card-header">
                  <Typography variant="headline" className="card-header_title">
                    Animal
                  </Typography>
                </div>
                <div className="card-body">
                  <FormControl style={{ width: '35%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Nome*</InputLabel>
                    <Input name="name" value={name} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '10%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Número</InputLabel>
                    <Input name="number" value={number} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '15%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Número do chip</InputLabel>
                    <Input name="chipNumber" value={chipNumber} onChange={this.handleChange} />
                  </FormControl>
                  {animalTypes && (
                    <FormControl style={{ width: '30%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Tipo de animal*</InputLabel>
                      <Select name="animalType" value={animalType} onChange={this.handleChange}>
                        {animalTypes.map(type => {
                          return (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  {sexList && (
                    <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Sexo*</InputLabel>
                      <Select name="sex" value={sex} onChange={this.handleChange}>
                        {sexList.map(sex => {
                          return (
                            <MenuItem key={sex.id} value={sex.id}>
                              {sex.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                    <TextField
                      type="date"
                      label="Data de nascimento"
                      name="birthDate"
                      value={birthDate ? birthDate : new Date().toJSON().slice(0, 10)}
                      onChange={this.handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                  <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Raça</InputLabel>
                    <Input name="breed" value={breed} onChange={this.handleChange} />
                  </FormControl>
                  {sex !== '' &&
                    sex === 2 && (
                      <Fragment>
                        <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>Periodo de gestação</InputLabel>
                          <Input
                            name="gestationPeriod"
                            value={gestationPeriod}
                            onChange={this.handleChange}
                          />
                        </FormControl>
                        <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>Idade de reprodução</InputLabel>
                          <Input
                            name="reproductionAge"
                            value={reproductionAge}
                            onChange={this.handleChange}
                          />
                        </FormControl>
                        <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>Peso de reprodução</InputLabel>
                          <Input
                            name="reproductionWeight"
                            value={reproductionWeight}
                            onChange={this.handleChange}
                          />
                        </FormControl>
                      </Fragment>
                    )}
                  <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Número de chip (mãe)</InputLabel>
                    <Input name="motherNumber" value={motherNumber} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Nome da mãe</InputLabel>
                    <Input name="motherName" value={motherName} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Número de chip (pai)</InputLabel>
                    <Input name="fatherNumber" value={fatherNumber} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Nome do pai</InputLabel>
                    <Input name="fatherName" value={fatherName} onChange={this.handleChange} />
                  </FormControl>
                  <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                    <InputLabel>Tipo de sangue</InputLabel>
                    <Input name="bloodType" value={bloodType} onChange={this.handleChange} />
                  </FormControl>
                  {groupList && (
                    <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                      <InputLabel>Grupo(s)</InputLabel>
                      <Select
                        multiple
                        name="group"
                        value={group}
                        onChange={this.handleChange}
                        input={<Input id="select-multiple-checkbox" />}
                        renderValue={selected => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {groupList.map(group => (
                          <MenuItem key={group.id} value={group.name}>
                            <Checkbox
                              color="primary"
                              checked={this.state.group.indexOf(group.name) > -1}
                            />
                            <ListItemText primary={group.name} />
                          </MenuItem>
                        ))}
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
        {errors && (
          <ErrorDialog
            title="Input Errors"
            text="There are some input errors"
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

export default CreateOrUpdateExplorationAnimalPage;
