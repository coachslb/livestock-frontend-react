import React, { Component, Fragment } from 'react';
import { Card, CardContent, Button, CircularProgress, Typography } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import InputForm from '../../../UI/Inputs/InputForm';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import SelectForm from '../../../UI/Inputs/SelectForm';
import FixedValuesService from '../../../../services/FixedValuesService';
import ExplorationService from '../../../../services/ExplorationService';
import ManagementBirthRegistrationService from '../../../../services/ManagementBirthRegistrationService';

class CreateorUpdateBirthRegistrationManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      animalTypeList: null,
      sexTypes: null,
      birthRegistration: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  onSubmit = async values => {
    const { entityId } = this.props.match.params;
    this.setState({ isLoading: true });
    if (values.id) {
      let updateBirthRegistrationResponse = ManagementBirthRegistrationService.update(
        values,
        true,
      );

      updateBirthRegistrationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          console.log(err)
          this.setState({ serverError: true, isLoading: false });
        });
    } else {
      let createBirthRegistrationResponse = ManagementBirthRegistrationService.create(
        values,
        true,
      );

      createBirthRegistrationResponse
        .then(res => {
          this.setState({ isLoading: false });
          this.props.history.push(`/livestock/management/${entityId}`);
        })
        .catch(err => {
          console.log(err)
          this.setState({ serverError: true, isLoading: false });
        });
      
    }
    //window.alert(JSON.stringify(values, 0, 2));
  };

  //TODO
  validate = values => {
    const errors = {};
    return errors;
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  onCancel = e => {
    const { entityId } = this.props.match.params;
    this.props.history.push(`/livestock/management/${entityId}`);
  };

  componentWillMount() {
    const { entityId } = this.props.match.params;
    this.setState({ isLoading: true });

    let explorationsPromise = ExplorationService.get(null, entityId, true);
    let animalTypesPromise = FixedValuesService.getExplorationTypes(true);
    let sexTypesPromise = FixedValuesService.getSexTypes(true);

    sexTypesPromise
      .then(res => this.setState({ sexTypes: res.data }))
      .catch(err => this.setState({ serverError: true }));

    animalTypesPromise
      .then(res => {
        this.setState({ animalTypeList: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    explorationsPromise
      .then(res => this.setState({ explorationList: res.data, isLoading: false }))
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  render() {
    const { entityId } = this.props.match.params;
    const {
      isLoading,
      serverError,
      explorationList,
      animalTypeList,
      sexTypes,
      birthRegistration,
    } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Nascimento" />
            <Form
              onSubmit={this.onSubmit}
              mutators={{
                ...arrayMutators,
              }}
              initialValues={{ ...birthRegistration }}
              validate={this.validate}
              render={({
                handleSubmit,
                values,
                form: {
                  mutators: { push, pop },
                },
              }) => (
                <form onSubmit={handleSubmit}>
                  <Card style={{ marginTop: 20 }}>
                    <CardContent>
                      <div className="card-header">
                        <Typography variant="headline" className="card-header_title">
                          Dados gerais
                        </Typography>
                      </div>
                      <div className="card-body">
                        <InputForm name="id" type="hidden" />
                        <InputForm
                          name="date"
                          required={true}
                          type="date"
                          label="Data"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        {animalTypeList && (
                          <SelectForm
                            label="Exploração"
                            name="exploration"
                            required={true}
                            style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                            list={explorationList}
                          />
                        )}
                        <InputForm
                          label="Número da mãe"
                          name="motherNumber"
                          required={true}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Nome da mãe"
                          name="motherName"
                          required={false}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Número do pai"
                          name="fatherNumber"
                          required={false}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Nome do pai"
                          name="fatherName"
                          required={false}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        {animalTypeList && (
                          <SelectForm
                            label="Tipo de animal"
                            name="animalType"
                            required={true}
                            type="text"
                            style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                            list={animalTypeList}
                          />
                        )}
                        <InputForm
                          label="Raça"
                          name="breed"
                          required={false}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Observations"
                          name="observations"
                          required={false}
                          type="text"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <FieldArray name="animalData">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Card style={{ marginTop: 20 }} key={name}>
                          <CardContent>
                            <div className="card-header">
                              <Typography variant="headline" className="card-header_title">
                                {index + 1}. Animal
                              </Typography>
                              <i className="material-icons" onClick={() => fields.remove(index)}>
                                delete
                              </i>
                            </div>
                            <div className="card-body">
                              <InputForm
                                name={`${name}.id`}
                                required={false}
                                type="hidden"
                              />
                              <InputForm
                                label="Nome"
                                name={`${name}.name`}
                                required={false}
                                type="text"
                                style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label="Número"
                                name={`${name}.number`}
                                required={true}
                                type="number"
                                style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label="Número do chip"
                                name={`${name}.chipNumber`}
                                required={false}
                                type="text"
                                style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                              />
                              {sexTypes && (
                                <SelectForm
                                  label="Sexo"
                                  name={`${name}.sex`}
                                  required={true}
                                  style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                                  list={sexTypes}
                                />
                              )}
                              <InputForm
                                label="Tipo de sangue"
                                name={`${name}.bloodType`}
                                required={false}
                                type="text"
                                style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label="Peso"
                                name={`${name}.weight`}
                                required={false}
                                type="number"
                                style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </FieldArray>
                  <Card style={{ marginTop: 20 }}>
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="headline" style={{ flexGrow: 1 }}>
                        Adicionar mais um nascimento
                      </Typography>
                      <i className="material-icons" onClick={() => push('animalData')}>
                        add
                      </i>
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
                      type="submit"
                    >
                      Guardar
                    </Button>
                  </div>
                </form>
              )}
            />
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

export default CreateorUpdateBirthRegistrationManagementPage;
