import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyExploration = props => {
  console.log(props);
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section="Explorações"
        description="Aqui pode adicionar novas explorações. Clique em Adicionar"
        route={`/livestock/explorations/${props.id}/create`}
    />);
};

export default EmptyExploration;
