import React from 'react';

import EntityGeneralStatisticsCard from './EntityGeneralStatisticsCard';
import LastManagementsCard from './LastManagementsCard';

const StatisticsSection = (props) => {
    return (
    <div className="statistics-section">
        <EntityGeneralStatisticsCard 
            explorations={props.agricolaEntity.explorations} 
            places={props.agricolaEntity.places}
            animals={props.agricolaEntity.animals}
            managements={props.agricolaEntity.managementNumber}
            users={props.agricolaEntity.users}
            i18n={props.i18n.dashboard.entityGeneralStatistics}
        />
        <LastManagementsCard 
            agricolaEntity={props.entityId}
            data={props.management.managements}
            i18n={props.i18n.dashboard}
        />
    </div>)
}

export default StatisticsSection;