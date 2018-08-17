import React, { Fragment, Component } from 'react';
import { I18nContext } from '../../../App';
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  CircularProgress,
} from 'material-ui';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import DeleteIcon from '@material-ui/icons/Delete';
import Calendar from '../../../livestock/calendar/Calendar';
import CreateTask from '../../../livestock/task/CreateTask';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import InputForm from '../../../UI/Inputs/InputForm';
import SelectForm from '../../../UI/Inputs/SelectForm';
import TaskService from '../../../../services/TaskService';
import WorkerService from '../../../../services/WorkerService';
import { formatDate } from '../../../utils/dateUtils';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class TaskPage extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      workerList: [],
      serverError: null,
      isLoading: null,
      task: null,
      openTask: false,
      editingTask: false,
      createNewTask: false,
      date: null,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const entityId = localStorage.getItem('entityId');

    if (entityId) {
      const getTasksList = TaskService.get(null, entityId, true);
      let getUserEntityResponse = WorkerService.getWorkers(entityId, true);

      getUserEntityResponse
        .then(res => {
          this.setState({ isLoading: false, workerList: res.data });
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false });
        });

      getTasksList
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ tasks: res.data, isLoading: false });
          } else this.setState({ isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  handleClose = e => {
    this.setState({ openTask: false });
  };

  handleEditOrCreateClose = e => {
    this.setState({ editingTask: false, createNewTask: false });
  };

  handleEdit = e => {
    this.setState({ editingTask: true, openTask: false });
  };

  deleteTask = taskId => {
    const entityId = localStorage.getItem('entityId');
    const deleteTaskResponse = TaskService.delete(taskId, entityId, false, true);

    deleteTaskResponse
      .then(res => {
        this.setState({ isLoading: false, openTask: false, editingTask: false, tasks: res.data });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false, openTask: false, editingTask: false });
      });
  }

  onSubmit = async values => {
    this.setState({ isLoading: true });
    values.creator = localStorage.getItem('workerId');

    if(this.state.createNewTask){
      const createTaskResponse = TaskService.create(values, true);

      createTaskResponse
        .then(res => {
          this.setState({ isLoading: false, tasks: res.data, openTask: false, editingTask: false, createNewTask: false });
        })
        .catch(err => {
          this.setState({ serverError: true, isLoading: false, openTask: false, editingTask: false, createNewTask: false });
        }); 
    }else{
      const updateTaskResponse = TaskService.update(values, true);

    updateTaskResponse
      .then(res => {
        this.setState({ isLoading: false, tasks: res.data, openTask: false, editingTask: false });
      })
      .catch(err => {
        this.setState({ serverError: true, isLoading: false, openTask: false, editingTask: false });
      }); 
    }

    
  };

  render() {
    const { isLoading, serverError, task, openTask, editingTask, createNewTask, workerList } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading &&
              !serverError && (
                <Fragment>
                  <Calendar
                    i18n={i18n}
                    tasks={this.state.tasks}
                    showTaskDetail={(task) =>
                      this.setState({ task: task, openTask: true })
                    }
                    addNewTask={(event) => {
                      this.setState({createNewTask: true, task: {start: event.start, end: event.end }})
                    }}
                  />
                  <CreateTask i18n={i18n} addTask={tasks => this.setState({ tasks })} />
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
                  position: 'fixed',
                }}
              />
            )}
            {task &&
              openTask && (
                <Dialog
                  open={openTask}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'baseline',
                      }}
                    >
                      <DialogTitle id="alert-dialog-slide-title" style={{ flexGrow: 1 }}>
                        {task.title}
                      </DialogTitle>
                      {task.creator === Number(localStorage.getItem('workerId')) && (
                        <DeleteIcon onClick={() => this.deleteTask(task.id)} />
                      )}
                    </div>
                  </div>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      {task.description}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <div>
                      {formatDate(task.start)} - {formatDate(task.end)}
                    </div>
                    {task.creator === Number(localStorage.getItem('workerId')) && (
                      <Button onClick={this.handleEdit} color="primary">
                        {i18n.general.edit}
                      </Button>
                    )}
                    <Button onClick={this.handleClose} color="primary">
                      {i18n.general.close}
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            {((task &&
              editingTask) || createNewTask) && (
                <Dialog
                  open={editingTask || createNewTask}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleEditOrCreateClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
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
                                {i18n.task.task}
                              </Typography>
                            </div>
                            <div className="card-body">
                              <InputForm
                                label={i18n.task.title}
                                name="title"
                                required={false}
                                type="text"
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              />
                              {workerList && (
                                <SelectForm
                                  label={i18n.task.target}
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
                                label={i18n.task.beginDate}
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                name="end"
                                required={true}
                                type="date"
                                label={i18n.task.endDate}
                                style={{ width: '45%', margin: '10px', marginBottom: '40px' }}
                              />
                              <InputForm
                                label={i18n.task.description}
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
                                onClick={this.handleEditOrCreateClose}
                              >
                                {i18n.task.cancel}
                              </Button>
                              <Button
                                size="medium"
                                variant="raised"
                                color="primary"
                                className="card-button"
                                type="submit"
                                disabled={invalid || pristine}
                              >
                                {i18n.task.save}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </form>
                    )}
                  />
                </Dialog>
              )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default TaskPage;
