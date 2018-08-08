import React from 'react';
import { Typography } from 'material-ui';
import { Button } from 'material-ui';

const ListCardUsers = props => {
  function onClick(e, id) {
    props.onClick(e, props.data.id);
  }

  function onEdit(e, id) {
    props.onEdit(e, props.data.id);
  }

  function onDelete(e, id) {
    props.onDelete(e, props.data.id);
  }

  return (
    <div className="card-container">
      <div className="card-info" onClick={onClick}>
        <Typography variant="title" style={{ marginTop: '20px' }}>
          {`${props.data.username} ${props.data.manage ? '(Gerente)' : ''}` }
        </Typography>
        <p>{props.data.function}</p>
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
        {!props.data.manage && (
          <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onDelete}
        >
          Desassociar
        </Button>
        )}
        
      </div>
    </div>
  );
};

export default ListCardUsers;