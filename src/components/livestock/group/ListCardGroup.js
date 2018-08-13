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
        <p>{props.data.place ? props.data.place.name : ''}</p>
      </div>
      <div className="card-actions">
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onEdit}
        >
          {props.i18n.button.edit}
        </Button>
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onDelete}
        >
          {props.i18n.button.remove}
        </Button>
      </div>
    </div>
  );
};

export default ListCardGroup;
