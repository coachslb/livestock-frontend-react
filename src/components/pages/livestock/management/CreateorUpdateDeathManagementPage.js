import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';

class CreateorUpdateDeathManagementPage extends Component {
  render() {
    const { entityId } = this.props.match.params;
    return (
      <Fragment>
        <ManagementCreationCard step={2} entityId={entityId}/>
        <p>Create Death Management!!!</p>
      </Fragment>
    );
  }
}

export default CreateorUpdateDeathManagementPage;