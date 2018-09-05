import React from 'react';
import {Doughnut} from 'react-chartjs-2';

export const DoughnutChart = (props) => {
    return <Doughnut data={props.data} legend={props.legend}/>
}