import React from 'react';
import EntityGeneralStatisticsCard from './EntityGeneralStatisticsCard';
import LastManagementsCard from './LastManagementsCard';
import LastInventoryProductsCard from './LastInventoryProductsCard';

const StatisticsSection = (props) => {
    return (
    <div className="statistics-section">
        <EntityGeneralStatisticsCard 
            explorations={props.agricolaEntity.explorations} 
            animals={props.agricolaEntity.animals}
            users={props.agricolaEntity.users}
        />
        <LastManagementsCard 
            data="hello"
        />
        <LastInventoryProductsCard 
            data="Goodbye"
        />
    </div>)
}

export default StatisticsSection;