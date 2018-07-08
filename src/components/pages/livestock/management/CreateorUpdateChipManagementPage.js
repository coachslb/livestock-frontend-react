import React, { Component, Fragment } from 'react';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';

class CreateorUpdateChipManagementPage extends Component {

    render(){
        const { entityId } = this.props.match.params;
        return(
        <Fragment>
            <ManagementCreationCard step={2} entityId={entityId}/>
            <p>Create Child Birth!!!</p>
        </Fragment>
        );
    }
}

export default CreateorUpdateChipManagementPage;