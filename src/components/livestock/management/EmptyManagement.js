import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyManagement = props => {
  return (
    <EmptyListPlaceholder 
        img="management-img" 
        section="Maneios"
        description="Aqui pode adicionar novos maneios efectuados aos seus animais. Clique em Adicionar"
        route={`/livestock/management/${props.entityId}/create`} 
    />);
};

export default EmptyManagement;