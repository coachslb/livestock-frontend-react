import React, { Component, Fragment } from 'react';
import { Button, CircularProgress } from 'material-ui';
import EmptyManagement from '../../../../components/livestock/management/EmptyManagement';
import ListCardManagement from '../../../../components/livestock/management/ListCardManagement';
import ManagementService from '../../../../services/ManagementService';

class ManagementPage extends Component {
    
    constructor() {
        super();
        this.state = {
          serverError: false,
          isLoading: false,
          hasData: false,
          managements: null,
        };
      }
      componentDidMount() {
        this.setState({ isLoading: true });
        const { entityId } = this.props.match.params;
    
        if (entityId) {
          const getManagementList = ManagementService.get(entityId, true);
    
          getManagementList
            .then(res => {
              if (res.data.length > 0) {
                this.setState({ hasData: true, isLoading: false, managements: res.data });
              } else this.setState({ hasData: false, isLoading: false });
            })
            .catch(err => this.setState({ serverError: true, isLoading: false }));
        }
      }
    
      /* onEdit = (e, groupId) => {
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
      }; */
    
      onCreateManagement = (e) => {
        e.preventDefault();
        this.props.history.push(`/livestock/management/${this.props.match.params.entityId}/create`);
      }
    
      render() {
        const { entityId } = this.props.match.params;
        const { hasData, managements, isLoading } = this.state;
        let render = <EmptyManagement entityId={entityId} />;
        if (hasData && !isLoading)
          render = managements.map(management => {
            return (
              <ListCardManagement
                key={management.id}
                data={management}
                /* onEdit={this.onEdit}
                onDelete={this.onDelete} */
              />
            );
          });
        return (
          <Fragment>
            {!isLoading && render}
            {hasData &&
              !isLoading && (
                <Button
                  className="placeholder-button-text"
                  variant="raised"
                  style={{ width: '100%' }}
                  color="primary"
                  onClick={this.onCreateManagement}
                >
                  + Adicionar
                </Button>
              )}
            {isLoading && (
              <CircularProgress
                style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
              />
            )}
          </Fragment>
        );
      }

}

export default ManagementPage;