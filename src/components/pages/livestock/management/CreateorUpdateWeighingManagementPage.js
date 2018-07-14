import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Card, CardContent, Button, CircularProgress, Typography } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ExplorationService from '../../../../services/ExplorationService';

class CreateorUpdateWeighingManagementPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: null,
      serverError: null,
      explorationList: null,
      weighing: {
        date: new Date().toJSON().slice(0, 10),
      },
    };
  }

  componentWillMount(){
    this.setState({ isLoading: true });
    const {entityId} = this.props.match.params;

    let explorationsPromise = ExplorationService.get(null, entityId, true);

    explorationsPromise.then(res => {
      this.setState({ explorationList: res.data, isLoading: false });
    });
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

  render() {
    const { entityId } = this.props.match.params;
    const { isLoading, serverError, explorationList, weighing } = this.state;
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            <ManagementCreationCard step={2} entityId={entityId} title="Pesagem" />
            <Form
              onSubmit={this.onSubmit}
              mutators={{
                ...arrayMutators,
              }}
              initialValues={{ ...weighing }}
              validate={this.validate}
              render={({ handleSubmit, values, form: {mutators: { push, pop }} }) => (
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
                          name="date"
                          required={true}
                          type="date"
                          label="Data"
                          style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                        />
                        {explorationList && (
                          <SelectForm
                            label="Exploração"
                            name="exploration"
                            required={true}
                            style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                            list={explorationList}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <FieldArray name="animals">
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
                                label="Animal"
                                name={`${name}.name`}
                                required={true}
                                type="text"
                                style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label="Peso"
                                name={`${name}.weight`}
                                required={true}
                                type="number"
                                style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label="Razão da pesagem"
                                name={`${name}.reason`}
                                required={false}
                                type="text"
                                style={{ width: '30%', margin: '10px', marginBottom: '40px' }}
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
                        Adicionar mais um animal
                      </Typography>
                      <i className="material-icons" onClick={() => push('animals')}>
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

export default CreateorUpdateWeighingManagementPage;