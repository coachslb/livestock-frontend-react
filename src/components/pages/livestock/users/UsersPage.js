import React, { Component, Fragment } from 'react';
import { Button, CircularProgress } from 'material-ui';
import ListCardUsers from '../../../livestock/user/ListCardUsers';
import WorkerService from '../../../../services/WorkerService';

class UsersPage extends Component {
  constructor() {
    super();
    this.state = {
      workers: null,
      hasData: null,
      serverError: null,
      isLoading: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    if (id) {
      const getUserResponse = WorkerService.getWorkers(id, true);

      getUserResponse
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ hasData: true, isLoading: false, workers: res.data });
          } else this.setState({ hasData: false, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onEdit = (e, id) => {
    e.preventDefault();
    this.props.history.push(`/livestock/users/${this.props.match.params.id}/edit/${id}`);
  };

  onDelete = (e, id) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const desassociateUserEntityResponse = WorkerService.delete(
      id,
      this.props.match.params.id,
      true,
    );
    desassociateUserEntityResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, workers: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onClick = (e, id) => {
    e.preventDefault();
    this.props.history.push(`/livestock/users/${this.props.match.params.id}/detail/${id}`);
  };

  onCreateUser = e => {
    e.preventDefault();
    this.props.history.push(`/livestock/users/${this.props.match.params.id}/create`);
  };

  render() {
    const { isLoading, hasData, workers } = this.state;
    return (
      <Fragment>
        {hasData &&
          !isLoading && (
            <Button
              className="placeholder-button-text"
              variant="raised"
              style={{ width: '100%', padding: '15px', marginBottom: '20px' }}
              color="primary"
              onClick={this.onCreateUser}
            >
              + Adicionar
            </Button>
          )}
        {hasData &&
          !isLoading &&
          workers.map(w => {
            return (
              <ListCardUsers
                key={w.id}
                data={w}
                onEdit={this.onEdit}
                onDelete={this.onDelete}
                onClick={this.onClick}
              />
            );
          })}
        {(isLoading || !hasData) && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default UsersPage;
