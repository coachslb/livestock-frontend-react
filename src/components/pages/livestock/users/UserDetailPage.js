import React, { Component, Fragment } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import WorkerService from '../../../../services/WorkerService';
import { I18nContext } from '../../../App';

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
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading &&
              worker && (
                <Card>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title">
                        {worker.name} {worker.manage ? '(' + i18n.users.manager + ')' : ''}
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
                          <label className="field-label">{i18n.users.phone}</label>
                        </div>
                      )}
                      {worker.function && (
                        <div className="card-field col-6">
                          <p className="field-info">{worker.function}</p>
                          <label className="field-label">{i18n.users.role}</label>
                        </div>
                      )}
                      {worker.country && (
                        <div className="card-field col-6">
                          <p className="field-info">{worker.country}</p>
                          <label className="field-label">{i18n.users.country}</label>
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
                      {i18n.users.button.edit}
                    </Button>
                  </div>
                </Card>
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
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default UserDetailPage;
