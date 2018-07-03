import React from 'react';
import FirstUseCard from './FirstUseCard';

const FirstUseSection = (props) => {
    return (
    <div className="first-use-section">
        <FirstUseCard 
            imgClass="entity-img" 
            step="1. Complete os dados da sua entidade"
            buttonText="Completar"
            hasExploration={props.hasExploration}
            route={`/livestock/entity/${props.entityId}`}
        />
        <FirstUseCard 
            imgClass="exploration-img" 
            hasExploration={props.hasExploration}
            step={props.hasExploration ? "2. Ver explorações" : "2. Crie uma exploração"}
            buttonText={props.hasExploration ? "Ir para explorações" : "Criar exploração"}
            route={props.hasExploration ? `/livestock/explorations/${props.entityId}` : `/livestock/explorations/${props.entityId}/create`}
        />
        <FirstUseCard 
            imgClass="animals-img"
            step="3. Insira os seus animais"
            hasExploration={props.hasExploration}
            buttonText={props.hasExploration ? "Criar Animal" : "Crie primeiro uma exploração"}
            route={props.hasExploration ? `/livestock/explorations/${props.entityId}` : `/livestock/explorations/${props.entityId}/create`}
        />
    </div>)
}

export default FirstUseSection;