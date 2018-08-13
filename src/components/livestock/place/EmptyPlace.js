import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyPlace = props => {
  return (
    <EmptyListPlaceholder
      img="exploration-img"
      section={props.i18n.place.places}
      description={props.i18n.place.description}
      route={`/livestock/explorations/${props.entityId}/place/${props.explorationId}/create`}
      add={props.i18n.button.add}
    />
  );
};

export default EmptyPlace;
