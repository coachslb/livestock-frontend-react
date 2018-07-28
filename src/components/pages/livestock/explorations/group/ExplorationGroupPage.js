import React, { Component, Fragment } from 'react';
import { CircularProgress, Button } from 'material-ui';
import GroupService from '../../../../../services/GroupService';
import EmptyGroup from '../../../../livestock/group/EmptyGroup';
import ListCardGroup from '../../../../livestock/group/ListCardGroup';

class ExplorationGroupPage extends Component {
  constructor() {
    super();
    this.state = {
      serverError: false,
      isLoading: false,
      hasData: false,
      groups: null,
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    const { explorationId } = this.props.match.params;

    if (explorationId) {
      const getGroupList = GroupService.get(null, explorationId, true);

      getGroupList
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ hasData: true, isLoading: false, groups: res.data });
          } else this.setState({ hasData: false, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onEdit = (e, groupId) => {
    e.preventDefault();
    const { entityId, explorationId } = this.props.match.params;
    this.props.history.push(`/livestock/explorations/${entityId}/group/${explorationId}/edit/${groupId}`);
  };

  onDelete = (e, groupId) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    this.setState({ isLoading: true });

    const deleteExplorationGroupResponse = GroupService.deleteGroup(
      groupId,
      id,
      false,
      true,
    );
    deleteExplorationGroupResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, groups: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onCreateGroup = (e) => {
    e.preventDefault();
    this.props.history.push(`/livestock/explorations/${this.props.match.params.entityId}/group/${this.props.match.params.explorationId}/create`);
  }

  render() {
    const { explorationId, entityId } = this.props.match.params;
    const { hasData, groups, isLoading } = this.state;
    let render = <EmptyGroup explorationId={explorationId} entityId={entityId} />;
    if (hasData && !isLoading)
      render = groups.map(group => {
        return (
          <ListCardGroup
            key={group.id}
            data={group}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
          />
        );
      });
    return (
      <Fragment>
        {hasData &&
          !isLoading && (
            <Button
              className="placeholder-button-text"
              variant="raised"
              style={{ width: '100%', padding: '15px', marginBottom: '20px' }}
              color="primary"
              onClick={this.onCreateGroup}
            >
              + Adicionar
            </Button>
          )}
        {!isLoading && render}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default ExplorationGroupPage;
