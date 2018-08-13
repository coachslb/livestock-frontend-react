import React, { Component, Fragment } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Card, CardContent, Typography, Button, CircularProgress } from 'material-ui';
import InputForm from '../../UI/Inputs/InputForm';
import SelectForm from '../../UI/Inputs/SelectForm';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import { withRouter } from 'react-router-dom';
import WorkerService from '../../../services/WorkerService';
import TaskService from '../../../services/TaskService';

class CreateTask extends Component {
  constructor() {
    super();
    this.state = {
      create: false,
      isLoading: null,
      serverError: null,
      workerList: [],
      task: {
        start: new Date().toJSON().slice(0, 10),
        end: new Date().toJSON().slice(0, 10),
      },
    };
  }

  componentWillMount() {
    const entityId = localStorage.getItem('entityId');
    let getUserEntityResponse = WorkerService.getWorkers(entityId, true);

    getUserEntityResponse
      .then(res => {
        this.setState({ isLoading: false, workerList: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false });
      });
  }

  onSubmit = async values => {
    this.setState({ isLoading: true });
    values.creator = localStorage.getItem('workerId');

    let createTaskResponse = TaskService.create(values, true);

    createTaskResponse
      .then(res => {
        this.setState({ isLoading: false, create: false });
        this.props.addTask(res.data);
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false, create: false });
      });
  };

  validate = values => {
    const errors = {};
    return errors;
  };

  onCancel = e => {
    this.setState({ create: false });
  };

  render() {
    const { create, workerList, task, isLoading, serverError } = this.state;

    let render;
    if (!create)
      render = (
        <Card style={{ marginTop: 20 }}>
          <CardContent style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="headline" style={{ flexGrow: 1 }}>
              {this.props.i18n.task.addNewTask}
            </Typography>
            <i className="material-icons" onClick={() => this.setState({ create: true })}>
              add
            </i>
          </CardContent>
        </Card>
      );
    else
      render = (
        <Form
          onSubmit={this.onSubmit}
          mutators={{
            ...arrayMutators,
          }}
          initialValues={{ ...task }}
          validate={this.validate}
          render={({
            handleSubmit,
            invalid,
            pristine,
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
                      {this.props.i18n.task.task}
                    </Typography>
                  </div>
                  <div className="card-body">
                    <InputForm
                      label={this.props.i18n.task.title}
                      name="title"
                      required={false}
                      type="text"
                      style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                    />
                    {workerList && (
                      <SelectForm
                        label={this.props.i18n.task.target}
                        name="target"
                        required={true}
                        list={workerList}
                        style={{
                          width: '45%',
                          margin: '10px',
                          marginBottom: '40px',
                        }}
                      />
                    )}
                    <InputForm
                      name="start"
                      required={true}
                      type="date"
                      label={this.props.i18n.task.beginDate}
                      style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                    />
                    <InputForm
                      name="end"
                      required={true}
                      type="date"
                      label={this.props.i18n.task.endDate}
                      style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                    />
                    <InputForm
                      label={this.props.i18n.task.description}
                      name="description"
                      required={false}
                      type="text"
                      style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      size="medium"
                      variant="raised"
                      color="primary"
                      className="card-button"
                      onClick={this.onCancel}
                    >
                      {this.props.i18n.task.cancel}
                    </Button>
                    <Button
                      size="medium"
                      variant="raised"
                      color="primary"
                      className="card-button"
                      type="submit"
                      disabled={invalid || pristine}
                    >
                      {this.props.i18n.task.save}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        />
      );

    return (
      <Fragment>
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
        {serverError && (
          <ErrorDialog
            title={this.props.i18n.general.serverErrorTitle}
            text={this.props.i18n.general.serverErrorMessage}
            onDialogClose={this.onDialogClose}
          />
        )}
        {!isLoading && !serverError && render}
      </Fragment>
    );
  }
}

export default withRouter(CreateTask);
