import React from 'react';
import EmptyListPlaceholder from '../../UI/Placeholders/EmptyListPlaceholder';

const EmptyExploration = props => {
  return (
    <EmptyListPlaceholder 
        img="exploration-img" 
        section={props.i18n.explorations}
        description={props.i18n.explorationDescription}
        route={`/livestock/explorations/${props.id}/create`}
        add={props.i18n.button.add}
    />);
};

export default EmptyExploration;
