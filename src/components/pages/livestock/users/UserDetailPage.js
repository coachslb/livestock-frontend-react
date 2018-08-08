import React, { Component, Fragment } from 'react';
import {Card, CardContent, Typography, Button, CircularProgress} from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import WorkerService from '../../../../services/WorkerService';

class UserDetailPage extends Component {

  constructor() {
    super();
    this.state = {
      worker: null,
      serverError: null,
      isLoading: null,
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    if (id) {
      const getUserResponse = WorkerService.getWorker(id, true);

      getUserResponse
        .then(res => {
            this.setState({ isLoading: false, worker: res.data });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onClick = e => {
    const { id, entityId } = this.props.match.params;
    e.preventDefault();
    this.props.history.push(`/livestock/users/${entityId}/edit/${id}`);
  };

  render() {
      const { worker, isLoading, serverError } = this.state;
    return (
        <Fragment>
        {!isLoading && worker && (
      <Card>
        <CardContent>
          <div className="card-header">
            <Typography variant="headline" className="card-header_title">
              {worker.username} {worker.manage ? '(Gerente)' : ''}
            </Typography>
          </div>
          <div className="card-body">
            {worker.email && (
              <div className="card-field col-6">
                <p className="field-info">{worker.email}</p>
                <label className="field-label">E-mail</label>
              </div>
            )}
            {worker.phone && (
              <div className="card-field col-6">
                <p className="field-info">{worker.phone}</p>
                <label className="field-label">Contacto</label>
              </div>
            )}
            {worker.function && (
              <div className="card-field col-6">
                <p className="field-info">{worker.function}</p>
                <label className="field-label">Função</label>
              </div>
            )}
            {worker.country && (
              <div className="card-field col-6">
                <p className="field-info">{worker.country}</p>
                <label className="field-label">País</label>
              </div>
            )}
          </div>
        </CardContent>
        <div className="card-actions">
          <Button
            size="medium"
            variant="raised"
            color="primary"
            className="card-button"
            onClick={this.onClick}
          >
            Editar
          </Button>
        </div>
      </Card>
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

export default UserDetailPage;
