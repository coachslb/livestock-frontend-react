import React from 'react';
import EntityGeneralStatisticsCard from './EntityGeneralStatisticsCard';
import LastManagementsCard from './LastManagementsCard';

const StatisticsSection = (props) => {
    console.log('Statistics', props)
    return (
    <div className="statistics-section">
        <EntityGeneralStatisticsCard 
            explorations={props.agricolaEntity.explorations} 
            places={props.agricolaEntity.places}
            animals={props.agricolaEntity.animals}
            managements={props.agricolaEntity.managementNumber}
            users={props.agricolaEntity.users}
        />
        <LastManagementsCard 
            agricolaEntity={props.entityId}
            data={props.management.managements}
        />
    </div>)
}

export default StatisticsSection;