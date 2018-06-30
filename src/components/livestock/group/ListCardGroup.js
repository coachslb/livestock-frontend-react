import React from 'react';
import { Typography, Button } from 'material-ui';
import '../exploration/exploration.css';

const ListCardGroup = props => {
  function onEdit(e, id) {
    props.onEdit(e, props.data.id);
  }

  function onDelete(e, id) {
    props.onDelete(e, props.data.id);
  }

  return (
    <div className="card-container">
      <div className="card-info">
        <Typography variant="title" style={{ marginTop: '20px' }}>
          {props.data.name}
        </Typography>
        <p>Local</p>
      </div>
      <div className="card-actions">
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onDelete}
        >
          Remover
        </Button>
      </div>
    </div>
  );
};

export default ListCardGroup;
