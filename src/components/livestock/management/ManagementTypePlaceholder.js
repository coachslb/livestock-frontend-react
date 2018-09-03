import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'material-ui';
import '../../pages/livestock/management/management.css';

const ManagementTypePlaceholder = props => {
  return (
      <div className={`management-type-container`}>
      <Link to={props.route}>
        <div className={`management-type ${props.imgUrl}`} />
        <Typography variant="title">{props.title}</Typography>
        </Link>
      </div>
    
  );
};

export default ManagementTypePlaceholder;
