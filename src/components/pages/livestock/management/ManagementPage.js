import React, { Component, Fragment } from 'react';
import { Button, CircularProgress } from 'material-ui';
import EmptyManagement from '../../../../components/livestock/management/EmptyManagement';
import ListCardManagement from '../../../../components/livestock/management/ListCardManagement';
import ManagementService from '../../../../services/ManagementService';
import ManagementChildBirthService from '../../../../services/ManagementChildBirthService';
import ManagementBirthRegistrationService from '../../../../services/ManagementBirthRegistrationService';
import ManagementWeighingService from '../../../../services/ManagementWeighingService';

const managementTypes = [
  //TODO transform in an object
  { id: 1, service: ManagementChildBirthService, name: 'childBirth' },
  { id: 2, service: ManagementBirthRegistrationService, name: 'birthRegistration' },
  { id: 3, service: ManagementWeighingService, name: 'weighing' },
];

// const aa={
//   1:  { id: 1, service: ManagementChildBirthService, name: 'childBirth' },
//   2:{ id: 2, service: ManagementBirthRegistrationService, name: 'birthRegistration' },
//   3:{ id: 3, service: ManagementWeighingService, name: 'weighing' },
// }

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

  getManagementType(managementTypeId){
    return managementTypes.find(managementType => managementType.id === managementTypeId);
  }

  onEdit = (e, managementId, managementTypeId) => {
    e.preventDefault();
    const managementType = this.getManagementType(managementTypeId);
    const { entityId } = this.props.match.params;
    this.props.history.push(`/livestock/management/${entityId}/edit/${managementType.name}/${managementId}`);
  };

  onDelete = (e, managementId,  managementTypeId) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { entityId } = this.props.match.params;
    const managementType = this.getManagementType(managementTypeId);

    const deleteManagementResponse = managementType.service.delete(
          managementId,
          entityId,
          true,
        );
        deleteManagementResponse
          .then(res => {
            if (res.data.length > 0) {
              this.setState({ hasData: true, isLoading: false, groups: res.data });
            } else this.setState({ hasData: false, isLoading: false });
          })
          .catch(err => this.setState({ serverError: true, isLoading: false })); 
  };

  onCreateManagement = e => {
    e.preventDefault();
    this.props.history.push(`/livestock/management/${this.props.match.params.entityId}/create`);
  };

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
              style={{ marginBottom: '20px', width: '100%' }}
              color="primary"
              onClick={this.onCreateManagement}
            >
              + Adicionar
            </Button>
          )}
          {!isLoading && render}
        
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'fixed' }}
          />
        )}
      </Fragment>
    );
  }
}

export default ManagementPage;
