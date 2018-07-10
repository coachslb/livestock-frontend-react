import React, { Component, Fragment } from 'react';
import { Card, CardContent, Button, CircularProgress, Typography } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import InputForm from '../../../UI/Inputs/InputForm';
import { Form } from 'react-final-form';

class CreateorUpdateBirthRegistrationManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
    };
  }

  onSubmit = async values => {
    console.log('hello');
    window.alert(JSON.stringify(values, 0, 2));
  };

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

  onCreate = e => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    const { entityId } = this.props.match.params;
    const { isLoading, serverError } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Parto" />
            <Form
              onSubmit={this.onSubmit}
              initialValues={{}}
              validate={this.validate}
              render={({ handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <Card style={{ marginTop: 20 }}>
                    <CardContent>
                      <div className="card-header">
                        <Typography variant="headline" className="card-header_title">
                          Dados gerais
                        </Typography>
                      </div>
                      <div className="card-body">
                        <InputForm
                          label="Número da mãe"
                          name="motherNumber"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Nome da mãe"
                          name="motherName"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Número do pai"
                          name="fatherNumber"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Nome do pai"
                          name="fatherName"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Tipo de animal"
                          name="animalType"
                          required={true}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Raça"
                          name="breed"
                          required={false}
                          type="text"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          name="birthDate"
                          required={true}
                          type="date"
                          style={{ width: '22%', margin: '10px', marginBottom: '40px' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card style={{ marginTop: 20 }}>
                    <CardContent>
                      <div className="card-header">
                        <Typography variant="headline" className="card-header_title">
                          1. Animal
                        </Typography>
                      </div>
                      <div className="card-body">
                        <InputForm
                          label="Nome"
                          name="name"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Número"
                          name="number"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Número do chip"
                          name="chipNumber"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Sexo"
                          name="sex"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Tipo de sangue"
                          name="bloodType"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
                        <InputForm
                          label="Peso"
                          name="weight"
                          required={false}
                          type="text"
                          style={{ width: '22.5%', margin: '10px', marginBottom: '40px' }}
                        />
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
                      type="submit"
                      /* onClick={this.onCreate} */
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
