import React from 'react';
import { Typography, Button } from 'material-ui';

const ListCardManagement = props => {
  function onEdit(e, id, type) {
    props.onEdit(e, props.data.id, props.data.type.id);
  }

  function onDelete(e, id, type) {
    props.onDelete(e, props.data.id, props.data.type.id);
  }

  return (
    <div className="card-container">
      <div className="card-info">
        <Typography variant="title" style={{ marginTop: '20px' }}>
          {props.data.type.name}
        </Typography>
        <p>00/00/00</p>
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

export default ListCardManagement;
