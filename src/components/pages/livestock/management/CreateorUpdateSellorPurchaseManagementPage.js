import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';

class CreateorUpdateSellorPurchaseManagementPage extends Component {
  render() {
    const { entityId } = this.props.match.params;
    return (
      <Fragment>
        <ManagementCreationCard step={2} entityId={entityId}/>
        <p>Create Sell or Purchase Management!!!</p>
      </Fragment>
    );
  }
}

export default CreateorUpdateSellorPurchaseManagementPage;