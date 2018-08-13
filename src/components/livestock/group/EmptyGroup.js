import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyGroup = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section={props.i18n.groups.groupsTitle}
        description={props.i18n.groups.description}
        route={`/livestock/explorations/${props.entityId}/group/${props.explorationId}/create`} 
        add={props.i18n.button.add}
    />);
};

export default EmptyGroup;