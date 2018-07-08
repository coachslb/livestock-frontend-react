import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';

class CreateorUpdateBirthRegistrationManagementPage extends Component {
  render() {
    const { entityId } = this.props.match.params;
    return (
      <Fragment>
        <ManagementCreationCard step={2} entityId={entityId}/>
        <p>Create Birth Registration!!!</p>
      </Fragment>
    );
  }
}

export default CreateorUpdateBirthRegistrationManagementPage;
