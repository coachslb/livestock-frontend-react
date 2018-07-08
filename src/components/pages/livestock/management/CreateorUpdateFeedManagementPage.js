import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';

class CreateorUpdateFeedManagementPage extends Component {
  render() {
    const { entityId } = this.props.match.params;
    return (
      <Fragment>
        <ManagementCreationCard step={2} entityId={entityId}/>
        <p>Create Weighing Management!!!</p>
      </Fragment>
    );
  }
}

export default CreateorUpdateFeedManagementPage;