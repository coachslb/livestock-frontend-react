import React from 'react';
import { Typography } from 'material-ui';
import { Button } from 'material-ui';
import './exploration.css';

const ListCardExploration = props => {
  function onClick(e, id) {
    props.onClick(e, props.data.id);
  }

  function onEdit(e, id) {
    props.onEdit(e, props.data.id);
  }

  function onDelete(e, id) {
    props.onDelete(e, props.data.id);
  }

  function getExplorationTypesFromId(explorationTypes) {
    explorationTypes.sort((a, b) => a.id - b.id);
    let first = true;
    return explorationTypes.map(type => {
      if (first) {
        first = false;
        return type.name;
      } else return ', ' + type.name;
    });
  }

  return (
    <div className="card-container">
      <div className="card-info" onClick={onClick}>
        <Typography variant="title" style={{ marginTop: '20px' }}>
          {props.data.name}
        </Typography>
        <p>{getExplorationTypesFromId(props.data.explorationTypes)}</p>
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

export default ListCardExploration;
