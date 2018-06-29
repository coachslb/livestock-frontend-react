import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyPlace = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section="Locais"
        description="Aqui pode adicionar novos locais à sua exploração. Clique em Adicionar"
        route={`/livestock/explorations/${props.entityId}/place/${props.explorationId}/create`} 
    />);
};

export default EmptyPlace;