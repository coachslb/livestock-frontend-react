import React, { Component, Fragment } from 'react';
import { Card, CardContent } from 'material-ui';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ManagementTypePlaceholder from '../../../livestock/management/ManagementTypePlaceholder';
import './management.css';

class SelectManagementTypePage extends Component {

  render() {
    const { entityId } = this.props.match.params;
    return (
      <Fragment>
        <ManagementCreationCard step={1} entityId={entityId} title="Maneio"/>
        <Card className="select-management-card">
            <CardContent className="select-management-card-container">
                <ManagementTypePlaceholder img="child-birth" title="Partos" route={`/livestock/management/${entityId}/create/childBirth`} />
                <ManagementTypePlaceholder img="birth-registration" title="Nascimentos" route={`/livestock/management/${entityId}/create/birthRegistration`} />
                <ManagementTypePlaceholder img="weighing" title="Pesagem" route={`/livestock/management/${entityId}/create/weighing`} />
                <ManagementTypePlaceholder img="feed" title="Alimentação" route={`/livestock/management/${entityId}/create/feed`} />
                <ManagementTypePlaceholder img="sanitary" title="Sanitários" route={`/livestock/management/${entityId}/create/sanitary`} />
                <ManagementTypePlaceholder img="coberturas" title="Coberturas" route={`/livestock/management/${entityId}/create/sex`} />
                <ManagementTypePlaceholder img="death" title="Mortes" route={`/livestock/management/${entityId}/create/death`} />
                <ManagementTypePlaceholder img="transfer" title="Transferências" route={`/livestock/management/${entityId}/create/transfer`} />
                <ManagementTypePlaceholder img="purchase-sales" title="Compras e vendas" route={`/livestock/management/${entityId}/create/sellorPurchase`} />
                <ManagementTypePlaceholder img="chiping" title="Chipagem" route={`/livestock/management/${entityId}/create/chip`} />
            </CardContent>
        </Card>
      </Fragment>
    );
  }
}

export default SelectManagementTypePage;
