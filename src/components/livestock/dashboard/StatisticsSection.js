import React from 'react';

import EntityGeneralStatisticsCard from './EntityGeneralStatisticsCard';
import DashboardWeatherCard from './DashboardWeatherCard';
import DashboardTaskCard from './DashboardTaskCard';

const StatisticsSection = (props) => {
    return (
    <div className="statistics-section">
        <EntityGeneralStatisticsCard 
            explorations={props.agricolaEntity.explorations} 
            places={props.agricolaEntity.places}
            animals={props.agricolaEntity.animals}
            sickAnimals={props.agricolaEntity.sickAnimals}
            managements={props.agricolaEntity.managementNumber}
            users={props.agricolaEntity.users}
            weighing={props.agricolaEntity.weighing}
            production={props.agricolaEntity.production}
            productionUnit="L"
            i18n={props.i18n.dashboard.entityGeneralStatistics}

        />
        <div className="dashboard-tasks-weather">
            <DashboardWeatherCard i18n={props.i18n.dashboard.weather} weather={props.weather}/>
            <DashboardTaskCard i18n={props.i18n.dashboard.task} tasks={props.tasks}/>
        </div>
        {/* <LastManagementsCard 
            agricolaEntity={props.entityId}
            data={props.management.managements}
            i18n={props.i18n.dashboard}
        /> */}
    </div>)
}

export default StatisticsSection;