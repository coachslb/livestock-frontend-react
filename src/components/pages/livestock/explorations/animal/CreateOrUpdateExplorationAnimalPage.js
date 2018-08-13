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
import GroupService from '../../../../../services/GroupService';
import { CardActions } from '@material-ui/core';
import { I18nContext } from '../../../../App';

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
      group: [],
    };
  }
  formatDate(date) {
    return date.slice(0, 10);
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    const { explorationId, id } = this.props.match.params;

    if (id) {
      const animalResponse = AnimalService.get(id, null, true);
      animalResponse
        .then(res => {
          this.setState({
            name: res.data.name ? res.data.name : '',
            number: res.data.number ? res.data.number : '',
            chipNumber: res.data.chipNumber ? res.data.chipNumber : '',
            animalType: res.data.explorationType ? res.data.explorationType.id : '',
            sex: res.data.sex ? res.data.sex.id : '',
            birthDate: res.data.birthDate ? this.formatDate(res.data.birthDate) : '',
            breed: res.data.breed ? res.data.breed : '',
            gestationPeriod: res.data.gestationPeriod ? res.data.gestationPeriod : '',
            reproductionAge: res.data.reproductionAge ? res.data.reproductionAge : '',
            reproductionWeight: res.data.reproductionWeight ? res.data.reproductionWeight : '',
            motherNumber: res.data.motherNumber ? res.data.motherNumber : '',
            motherName: res.data.motherName ? res.data.motherName : '',
            fatherNumber: res.data.fatherNumber ? res.data.fatherNumber : '',
            fatherName: res.data.fatherName ? res.data.fatherName : '',
            bloodType: res.data.bloodType ? res.data.bloodType : '',
            group: res.data.groups ? res.data.groups.map(elem => elem.name) : [],
          });
        })
        .catch(err => {
          this.setState({ serverError: true });
        });
    }
    const animalTypesResponse = FixedValuesService.getAnimalTypes(explorationId, true);
    const animalSexResponse = FixedValuesService.getSexTypes(true);
    const groupResponse = GroupService.get(null, explorationId, true);

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

    groupResponse
      .then(res => {
        this.setState({ groupList: res.data, isLoading: false });
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

  onCreate = (e, i18n) => {
    e.preventDefault();
    const { explorationId, id } = this.props.match.params;
    this.setState({ isLoading: true });
    const {
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
      group,
      groupList,
    } = this.state;
    let errors = ExplorationValidations.validateCreateOrUpdateAnimal(
      name,
      chipNumber,
      animalType,
      animalTypes,
      sex,
      sexList,
      birthDate,
      i18n
    );
    if (errors.length > 0) this.setState({ errors, isLoading: false });
    else {
      if (!id) {
        let groupIds = group.map(elem => groupList.find(exp => exp.name === elem).id);
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
            groups: groupIds,
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
        let groupIds = group.map(elem => groupList.find(exp => exp.name === elem).id);
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
            groups: groupIds,
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
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                <Card>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title">
                        {i18n.exploration.animals.animal}
                      </Typography>
                    </div>
                    <div className="card-body">
                      <FormControl style={{ width: '35%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.name}</InputLabel>
                        <Input name="name" value={name} onChange={this.handleChange} />
                      </FormControl>
                      <FormControl style={{ width: '10%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.number}*</InputLabel>
                        <Input name="number" value={number} onChange={this.handleChange} />
                      </FormControl>
                      <FormControl style={{ width: '15%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.chipNumber}</InputLabel>
                        <Input name="chipNumber" value={chipNumber} onChange={this.handleChange} />
                      </FormControl>
                      {animalTypes && (
                        <FormControl style={{ width: '30%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>{i18n.exploration.animals.animalType}*</InputLabel>
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
                          <InputLabel>{i18n.exploration.animals.sex}*</InputLabel>
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
                          label={i18n.exploration.animals.birthDate}
                          name="birthDate"
                          value={birthDate ? birthDate : new Date().toJSON().slice(0, 10)}
                          onChange={this.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                      <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.breed}</InputLabel>
                        <Input name="breed" value={breed} onChange={this.handleChange} />
                      </FormControl>
                      {sex !== '' &&
                        sex === 2 && (
                          <Fragment>
                            <FormControl
                              style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                            >
                              <InputLabel>{i18n.exploration.animals.gestationPeriod}</InputLabel>
                              <Input
                                name="gestationPeriod"
                                value={gestationPeriod}
                                onChange={this.handleChange}
                              />
                            </FormControl>
                            <FormControl
                              style={{ width: '23%', margin: '10px', marginBottom: '40px' }}
                            >
                              <InputLabel>{i18n.exploration.animals.reproductionAge}</InputLabel>
                              <Input
                                name="reproductionAge"
                                value={reproductionAge}
                                onChange={this.handleChange}
                              />
                            </FormControl>
                            <FormControl
                              style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                            >
                              <InputLabel>{i18n.exploration.animals.reproductionWeight}</InputLabel>
                              <Input
                                name="reproductionWeight"
                                value={reproductionWeight}
                                onChange={this.handleChange}
                              />
                            </FormControl>
                          </Fragment>
                        )}
                      <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.motherChipNumber}</InputLabel>
                        <Input
                          name="motherNumber"
                          value={motherNumber}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                      <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.motherName}</InputLabel>
                        <Input name="motherName" value={motherName} onChange={this.handleChange} />
                      </FormControl>
                      <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.fatherChipNumber}</InputLabel>
                        <Input
                          name="fatherNumber"
                          value={fatherNumber}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                      <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.fatherName}</InputLabel>
                        <Input name="fatherName" value={fatherName} onChange={this.handleChange} />
                      </FormControl>
                      <FormControl style={{ width: '22%', margin: '10px', marginBottom: '40px' }}>
                        <InputLabel>{i18n.exploration.animals.bloodType}</InputLabel>
                        <Input name="bloodType" value={bloodType} onChange={this.handleChange} />
                      </FormControl>
                      {groupList && (
                        <FormControl style={{ width: '23%', margin: '10px', marginBottom: '40px' }}>
                          <InputLabel>{i18n.exploration.groups.group}(s)</InputLabel>
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
                  </CardActions>
                </Card>
              </Fragment>
            )}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {errors && (
              <ErrorDialog
                title={i18n.general.inputErrorTitle}
                text={i18n.general.genericErrorMessage}
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

export default CreateOrUpdateExplorationAnimalPage;
