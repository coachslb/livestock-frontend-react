import React from 'react';
import { Typography, Button } from 'material-ui';

const ListCardManagement = props => {
  function onEdit(e, id, type) {
    props.onEdit(e, props.data.id, props.data.managementType.id);
  }

  function onDelete(e, id, type) {
    props.onDelete(e, props.data.id, props.data.managementType.id);
  }

  return (
    <div className="card-container">
      <div className="card-info">
        <Typography variant="title" style={{ marginTop: '20px' }}>
          {props.data.managementType.name}
        </Typography>
        <p>{props.data.date ? new Date(props.data.date).toLocaleDateString().slice(0, 10) : "00/00/00"}</p>
      </div>
      <div className="card-actions">
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onEdit}
        >
          {props.i18n.management.button.edit}
        </Button>
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={onDelete}
        >
          {props.i18n.management.button.remove}
        </Button>
      </div>
    </div>
  );
};

export default ListCardManagement;
