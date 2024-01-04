import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const DAY_DATA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const chartSetting = {
    yAxis: [
        {
            label: 'Temp °C',
        },
    ]
}
const Chart = ({ weatherDataOfCity }) => {
    function calculateTemp(data) {
        return data?.forecast?.forecastday?.map(val => val.day.avgtemp_c);
    }

    function calculateDay(data) {
        console.log(data?.forecast?.forecastday?.map(val => DAY_DATA[new Date(val.date).getDay()]));
        return data?.forecast?.forecastday?.map(val => DAY_DATA[new Date(val.date).getDay()]);
    }
    return (
        <LineChart
            xAxis={[{ data: calculateDay(weatherDataOfCity), scaleType: 'point' }]}
            series={[
                {
                    data: calculateTemp(weatherDataOfCity), color: '#ffcc00'
                },
            ]}
            width={500}
            height={150}
            margin={{ top: 10, bottom: 20 }}
            {...chartSetting}
        />
    )
}

export default Chart