import React from 'react';
import {Line} from 'react-chartjs-2';

export const LineChart = (props) => {
    return <Line data={props.data} legend={props.legend} height={props.height}/>
}