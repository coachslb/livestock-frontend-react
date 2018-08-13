import React from 'react';
import FirstUseCard from './FirstUseCard';

const FirstUseSection = props => {
  return (
    <div className="first-use-section">
      <FirstUseCard
        imgClass="entity-img"
        step={props.i18n.dashboard.firstUse.card1.step}
        buttonText={props.i18n.dashboard.firstUse.card1.buttonText}
        hasExploration={props.hasExploration}
        route={`/livestock/entity/${props.entityId}`}
      />
      <FirstUseCard
        imgClass="exploration-img"
        hasExploration={props.hasExploration}
        step={
          props.hasExploration
            ? props.i18n.dashboard.firstUse.card2.stepSee
            : props.i18n.dashboard.firstUse.card2.stepCreate
        }
        buttonText={
          props.hasExploration
            ? props.i18n.dashboard.firstUse.card2.buttonTextSee
            : props.i18n.dashboard.firstUse.card2.buttonTextCreate
        }
        route={
          props.hasExploration
            ? `/livestock/explorations/${props.entityId}`
            : `/livestock/explorations/${props.entityId}/create`
        }
      />
      <FirstUseCard
        imgClass="animals-img"
        step={props.i18n.dashboard.firstUse.card3.step}
        hasExploration={props.hasExploration}
        buttonText={
          props.hasExploration
            ? props.i18n.dashboard.firstUse.card3.buttonTextCreate
            : props.i18n.dashboard.firstUse.card3.buttonTextCreateHasNoExploration
        }
        route={
          props.hasExploration
            ? `/livestock/explorations/${props.entityId}`
            : `/livestock/explorations/${props.entityId}/create`
        }
      />
    </div>
  );
};

export default FirstUseSection;
