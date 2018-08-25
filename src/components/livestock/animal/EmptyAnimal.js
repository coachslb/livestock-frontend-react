import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyAnimal = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section={props.i18n.animals.animalsTitle}
        description={props.i18n.animals.description}
        route={`/livestock/explorations/${props.entityId}/animal/${props.explorationId}/create`} 
        add={props.i18n.button.add}
    />);
};

export default EmptyAnimal;