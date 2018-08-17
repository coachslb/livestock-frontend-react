import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyManagement = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img"  
        section={props.i18n.managements}
        description={props.i18n.description}
        route={`/livestock/management/${props.entityId}/create`} 
        add={props.i18n.button.add}
    />);
};

export default EmptyManagement;