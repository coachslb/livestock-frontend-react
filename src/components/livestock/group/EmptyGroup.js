import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyGroup = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section="Grupos"
        description="Aqui pode adicionar novos grupos de animais à sua exploração. Clique em Adicionar"
        route={`/livestock/explorations/${props.entityId}/group/${props.explorationId}/create`} 
    />);
};

export default EmptyGroup;