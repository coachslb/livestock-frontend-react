import React, { Component, Fragment } from 'react';
import { Card, CardContent } from 'material-ui';
import ManagementCreationCard from '../../../livestock/management/ManagementCreationCard';
import ManagementTypePlaceholder from '../../../livestock/management/ManagementTypePlaceholder';
import './management.css';
import { I18nContext } from '../../../App';

class SelectManagementTypePage extends Component {
  render() {
    const { entityId } = this.props.match.params;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            <ManagementCreationCard step={1} entityId={entityId} title={i18n.management.management} />
            <Card className="select-management-card">
              <CardContent className="select-management-card-container">
                <ManagementTypePlaceholder
                  img="child-birth"
                  title={i18n.management.managementType.childBirth}
                  route={`/livestock/management/${entityId}/create/childBirth`}
                />
                <ManagementTypePlaceholder
                  img="birth-registration"
                  title={i18n.management.managementType.birth}
                  route={`/livestock/management/${entityId}/create/birthRegistration`}
                />
                <ManagementTypePlaceholder
                  img="weighing"
                  title={i18n.management.managementType.weighing}
                  route={`/livestock/management/${entityId}/create/weighing`}
                />
                <ManagementTypePlaceholder
                  img="feed"
                  title={i18n.management.managementType.feeding}
                  route={`/livestock/management/${entityId}/create/feed`}
                />
                <ManagementTypePlaceholder
                  img="sanitary"
                  title={i18n.management.managementType.sanitary}
                  route={`/livestock/management/${entityId}/create/sanitary`}
                />
                <ManagementTypePlaceholder
                  img="coberturas"
                  title={i18n.management.managementType.servicing}
                  route={`/livestock/management/${entityId}/create/sex`}
                />
                <ManagementTypePlaceholder
                  img="death"
                  title={i18n.management.managementType.death}
                  route={`/livestock/management/${entityId}/create/death`}
                />
                <ManagementTypePlaceholder
                  img="transfer"
                  title={i18n.management.managementType.transfer}
                  route={`/livestock/management/${entityId}/create/transfer`}
                />
                <ManagementTypePlaceholder
                  img="purchase-sales"
                  title={i18n.management.managementType.sellAndPurchase}
                  route={`/livestock/management/${entityId}/create/sellorPurchase`}
                />
                <ManagementTypePlaceholder
                  img="chiping"
                  title={i18n.management.managementType.chiping}
                  route={`/livestock/management/${entityId}/create/chip`}
                />
              </CardContent>
            </Card>
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default SelectManagementTypePage;
