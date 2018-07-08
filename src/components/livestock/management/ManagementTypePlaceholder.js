import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'material-ui';
import '../../pages/livestock/management/management.css';

const ManagementTypePlaceholder = props => {
  return (
      <div className="management-type-container">
      <Link to={props.route}>
        <div style={{ width: 180, height: 180, border: '2px solid black', marginBottom: 10}} />
        <Typography variant="title">{props.title}</Typography>
        </Link>
      </div>
    
  );
};

export default ManagementTypePlaceholder;
