import React from 'react';
import {Bar} from 'react-chartjs-2';

export const BarChart = (props) => {
    return <Bar data={props.data} legend={props.legend} height={props.height} options={props.options}/>
}