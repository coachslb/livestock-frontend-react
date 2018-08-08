import React, { Component, Fragment } from 'react';
import { Button, CircularProgress } from 'material-ui';
import EmptyManagement from '../../../../components/livestock/management/EmptyManagement';
import ListCardManagement from '../../../../components/livestock/management/ListCardManagement';
import ManagementService from '../../../../services/ManagementService';
import ManagementChildBirthService from '../../../../services/ManagementChildBirthService';
import ManagementBirthRegistrationService from '../../../../services/ManagementBirthRegistrationService';
import ManagementWeighingService from '../../../../services/ManagementWeighingService';
import ManagementFeedingService from '../../../../services/ManagementFeedingService';
import ManagementDeathService from '../../../../services/ManagementDeathService';
import ManagementCoberturaService from '../../../../services/ManagementCoberturaService';
import ManagementSellOrPurchaseService from '../../../../services/ManagementSellOrPurchaseService';
import ManagementSanitaryService from '../../../../services/ManagementSanitaryService';
import ManagementChipService from '../../../../services/ManagementChipService';
import ManagementTransferService from '../../../../services/ManagementTransferService';

export const managementTypes = [
  //TODO transform in an object
  { id: 1, service: ManagementChildBirthService, name: 'childBirth' },
  { id: 2, service: ManagementBirthRegistrationService, name: 'birthRegistration' },
  { id: 3, service: ManagementWeighingService, name: 'weighing' },
  { id: 4, service: ManagementFeedingService, name: 'feed' },
  { id: 5, service: ManagementDeathService, name: 'death' },
  { id: 6, service: ManagementCoberturaService, name: 'sex' },
  { id: 7, service: ManagementSellOrPurchaseService, name: 'sellorPurchase' },
  { id: 8, service: ManagementSellOrPurchaseService, name: 'sellorPurchase' },
  { id: 9, service: ManagementTransferService, name: 'transfer' },
  { id: 10, service: ManagementSanitaryService, name: 'sanitary' },
  { id: 11, service: ManagementChipService, name: 'chip' },
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
  componentWillMount() {
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

  getManagementType(managementTypeId) {
    return managementTypes.find(managementType => managementType.id === managementTypeId);
  }

  onEdit = (e, managementId, managementTypeId) => {
    e.preventDefault();
    const managementType = this.getManagementType(managementTypeId);
    const { entityId } = this.props.match.params;
    this.props.history.push(
      `/livestock/management/${entityId}/edit/${managementType.name}/${managementId}`,
    );
  };

  onDelete = (e, managementId, managementTypeId) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { entityId } = this.props.match.params;
    const managementType = this.getManagementType(managementTypeId);

    const deleteManagement =
      managementTypeId === 7
        ? managementType.service.deleteSell
        : managementTypeId === 8
          ? managementType.service.deletePurchase
          : managementType.service.delete;
    const deleteManagementResponse = deleteManagement(managementId, entityId, true);
    deleteManagementResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, managements: res.data });
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
                style={{
                  marginBottom: '20px',
                  width: '100%',
                  padding: '15px',
                  zIndex: 1,
                }}
                color="primary"
                onClick={this.onCreateManagement}
              >
                + Adicionar
              </Button>
          )}
        {!isLoading && (
          <div style={{ maxHeight: 750, overflow: 'scroll', overflowX: 'hidden'}}>
            {render}
          </div>
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

export default ManagementPage;
