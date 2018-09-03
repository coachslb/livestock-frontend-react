import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography } from 'material-ui';
import { managementTypes } from '../../pages/livestock/management/ManagementPage';
import { formatDate } from '../../utils/dateUtils';
import './dashboard.css';

const LastManagementsCard = props => {
  function getManagementType(managementTypeId) {
    return managementTypes.find(managementType => managementType.id === managementTypeId);
  }

  function getManagementIcon(managementTypeId) {
    switch (managementTypeId) {
      case 1:
        return 'management-type--childBirth';
      case 2:
        return 'management-type--birth';
      case 3:
        return 'management-type--weighing';
      case 4:
        return 'management-type--feeding';
      case 5:
        return 'management-type--death';
      case 6:
        return 'management-type--servicing';
      case 7:
        return 'management-type--sellOrPurchase';
      case 8:
        return 'management-type--sellOrPurchase';
      case 9:
        return 'management-type--transfer';
      case 10:
        return 'management-type--sanitary';
      case 11:
        return 'management-type--chiping';
      case 12:
        return 'management-type--production';
      default:
        return 'management-type--production';
    }
  }

  return (
    <Card className="statistics-card">
      <CardContent
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Typography variant="title" color="primary" style={{marginBottom: 20}}>
          {props.i18n.lastManagements}
        </Typography>
        {props.data.map(management => (
          <Link
            key={management.id}
            to={`/livestock/management/${props.agricolaEntity}/edit/${
              getManagementType(management.managementType.id).name
            }/${management.id}`}
          >
            <div className="card-container" style={{minHeight: 120}}>
              <div>
                <Typography variant="headline">{management.managementType.name}</Typography>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span
                    className={`management-type ${getManagementIcon(management.managementType.id)}`}
                     style={{
                       borderRadius: '10%',
                       height: 64,
                       width: 64,
                       marginRight: '20px',
                     }}
                  />
                  <p>{management.date ? formatDate(management.date) : '00/00/00'}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default LastManagementsCard;
