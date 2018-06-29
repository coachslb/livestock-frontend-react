import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyAnimal = props => {
  console.log(props);
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section="Animais"
        description="Aqui pode adicionar novos animais à sua exploração. Clique em Adicionar"
        route={`/livestock/explorations/${props.entityId}/animal/${props.explorationId}/create`} 
    />);
};

export default EmptyAnimal;