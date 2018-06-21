import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'material-ui';
import './placeholderList.css'

const EmptyListPlaceholder = ({img, section, description, route }) => {
  return (
    <div className="empty-list-container">
      <div className={`placeholder-img ${img}`} />
      <p className="placeholder-title">{section}</p>
      <p className="placeholder-description">
        {description}
      </p>
      <Link className="placeholder-button" to={route}>
        <Button
          className="placeholder-button-text"
          variant="raised"
          style={{ width: '100%' }}
          color="primary"
        >
          + Adicionar
        </Button>
      </Link>
    </div>
  );
};

export default EmptyListPlaceholder;
