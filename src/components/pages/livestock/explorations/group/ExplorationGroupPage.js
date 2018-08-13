import React, { Component, Fragment } from 'react';
import { CircularProgress, Button } from 'material-ui';
import GroupService from '../../../../../services/GroupService';
import EmptyGroup from '../../../../livestock/group/EmptyGroup';
import ListCardGroup from '../../../../livestock/group/ListCardGroup';
import { I18nContext } from '../../../../App';

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
    this.props.history.push(
      `/livestock/explorations/${entityId}/group/${explorationId}/edit/${groupId}`,
    );
  };

  onDelete = (e, groupId) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    this.setState({ isLoading: true });

    const deleteExplorationGroupResponse = GroupService.deleteGroup(groupId, id, false, true);
    deleteExplorationGroupResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, groups: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onCreateGroup = e => {
    e.preventDefault();
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/group/${
        this.props.match.params.explorationId
      }/create`,
    );
  };

  render() {
    const { explorationId, entityId } = this.props.match.params;
    const { hasData, groups, isLoading } = this.state;
    let render = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <EmptyGroup explorationId={explorationId} entityId={entityId} i18n={i18n.exploration} />
        )}
      </I18nContext.Consumer>
    );
    if (hasData && !isLoading)
      render = groups.map(group => {
        return (
          <I18nContext.Consumer key={group.id}>
            {({ i18n }) => (
              <ListCardGroup
                data={group}
                onEdit={this.onEdit}
                onDelete={this.onDelete}
                i18n={i18n.exploration}
              />
            )}
          </I18nContext.Consumer>
        );
      });
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
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
                  + {i18n.exploration.button.add}
                </Button>
              )}
            {!isLoading && render}
            {isLoading && (
              <CircularProgress
                style={{
                  height: '80px',
                  width: '80px',
                  top: '50%',
                  left: '50%',
                  position: 'absolute',
                }}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ExplorationGroupPage;
