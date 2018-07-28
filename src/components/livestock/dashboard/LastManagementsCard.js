import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography } from 'material-ui';
import { managementTypes } from '../../pages/livestock/management/ManagementPage';

const LastManagementsCard = props => {
  
  function getManagementType(managementTypeId) {
    return managementTypes.find(managementType => managementType.id === managementTypeId);
  }
  
  return (
    <Card className="statistics-card">
      <CardContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Typography variant="title" color="primary">
          Últimos maneios
        </Typography>
        {props.data.map(management => (
          <Link key={management.id} to={`/livestock/management/${props.agricolaEntity}/edit/${getManagementType(management.managementType.id).name}/${management.id}`}>
            <div
              className="card-container"
              style={{ marginTop: '20px' }} 
            >
              <div>
                <Typography variant="headline">{management.managementType.name}</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      border: '2px solid black',
                      height: 48,
                      width: 48,
                      marginRight: '20px',
                    }}
                  />
                  <p>
                    {management.date
                      ? new Date(management.date).toLocaleDateString().slice(0, 10)
                      : '00/00/00'}
                  </p>
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
