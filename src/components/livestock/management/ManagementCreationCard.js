import React from 'react';
import { Card, CardContent } from 'material-ui';
import { Link } from 'react-router-dom';
import { Typography } from '../../../../node_modules/material-ui';
import '../../pages/livestock/management/management.css';

const ManagementCreationCard = props => {
  return (
    <Card className="header-select-management-card">
      <CardContent className="header-select-management-card-container">
        <div style={{ flexGrow: 1 }}>
          <Typography variant="headline">{props.title}</Typography>
        </div>
        <div style={{ justifyContent: 'space-between', display: 'flex', width: 100 }}>
          <Link to={`/livestock/management/${props.entityId}/create`} className={'step-border ' + (props.step === 1 ? 'selected' : '')}>
            <span>1</span>
          </Link>
          <span className={'step-border ' + (props.step === 2 ? 'selected' : '')}>2</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementCreationCard;
