import React from 'react';
import {Pie} from 'react-chartjs-2';

export const PieChart = (props) => {
    return <Pie data={props.data} legend={props.legend}/>
}