import React, { Component, Fragment } from 'react';
import { CircularProgress, Button } from 'material-ui';
import ExplorationService from '../../../../services/ExplorationService';
import EmptyExploration from '../../../livestock/exploration/EmptyExploration';
import ListCardExploration from '../../../livestock/exploration/ListCardExploration';

class ExplorationPage extends Component {
  constructor() {
    super();
    this.state = {
      explorations: null,
      hasData: null,
      serverError: null,
      isLoading: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    if (id) {
      const getExplorationsResponse = ExplorationService.get(null, id, true);

      getExplorationsResponse
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ hasData: true, isLoading: false, explorations: res.data });
          } else this.setState({ hasData: false, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onEdit = (e, id) => {
    e.preventDefault();
    this.props.history.push(`/livestock/explorations/${this.props.match.params.id}/edit/${id}`);
  };

  onDelete = (e, id) => {
    e.preventDefault();
    this.setState({ isLoading: true });

    const deleteExplorationResponse = ExplorationService.delete(
      id,
      this.props.match.params.id,
      true,
    );
    deleteExplorationResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, explorations: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onClick = (e, id) => {
    e.preventDefault();
    this.props.history.push(`/livestock/explorations/${this.props.match.params.id}/detail/${id}`);
  };
  
  onCreateExploration = (e) => {
    e.preventDefault();
    this.props.history.push(`/livestock/explorations/${this.props.match.params.id}/create`);
  }

  render() {
    const { isLoading, hasData, explorations } = this.state;
    const { id } = this.props.match.params;
    return (
      <Fragment>
        {!hasData && !isLoading && <EmptyExploration id={id} />}
        {hasData &&
          !isLoading && (
            <Button
              className="placeholder-button-text"
              variant="raised"
              style={{ width: '100%', padding: '15px', marginBottom: '20px' }}
              color="primary"
              onClick={this.onCreateExploration}
            >
              + Adicionar
            </Button>
          )}
        {hasData &&
          !isLoading &&
          explorations.map(el => {
            return (
              <ListCardExploration
                key={el.id}
                data={el}
                onEdit={this.onEdit}
                onDelete={this.onDelete}
                onClick={this.onClick}
              />
            );
          })}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default ExplorationPage;
