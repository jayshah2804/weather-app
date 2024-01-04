import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CITY_DATA = ["Bangalore", "Chennai", "Kolkata", "Delhi", "Mumbai"];
const city_temp_cache = {};
const chartSetting = {
    yAxis: [
        {
            label: 'Temp °C',
        },
    ]
}
const ComparisonChart = ({ cache }) => {
    const [isComparisonChartShow, setComparisonChartShow] = useState();
    const [tempData, setTempData] = useState();
    const [cityOne, setCityOne] = useState("");
    const [cityTwo, setCityTwo] = useState("");

    const handleCheckboxChange = (checkboxName) => {
        if (tempData.hasOwnProperty(checkboxName)) {
            let temp = { ...tempData };
            delete temp[checkboxName];
            setTempData(temp);
        }
        else {
            let temp = { ...tempData };
            temp[checkboxName] = city_temp_cache[checkboxName];
            setTempData(temp);
        }
    };

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return response.json();
        } catch (error) {
            throw new Error(`Error fetching data from ${url}: ${error.message}`);
        }
    }

    useEffect(() => {
        async function func() {
            let temp = [];
            CITY_DATA.map(val => {
                if (!cache.hasOwnProperty(val)) temp.push(val);
                else city_temp_cache[val] = cache[val].current.temp_c;
            })
            if (temp.length > 0) {
                const promises = temp.map(val => fetchData(`https://api.weatherapi.com/v1/current.json?q=${val},India&key=413473253f274b318b652628240401`));
                const results = await Promise.all(promises);
                results.map(val => {
                    city_temp_cache[val.location.name] = val.current.temp_c
                })
                console.log(city_temp_cache);
                setTempData(Object.assign(city_temp_cache));
            }
        }
        if (isComparisonChartShow)
            func();
    }, [isComparisonChartShow]);

    const defaultGraphClickHandler = () => {
        setTempData(city_temp_cache);
        setCityOne("");
        setCityTwo("");
    }

    const cityChangeHandler = (type, value) => {
        if (type === "city1") {
            setCityOne(value);
            cityTwo && setTempData(Object.keys(city_temp_cache).reduce((acc, cur) => {
                if (cur === value || cur === cityTwo) acc[cur] = city_temp_cache[cur];
                return acc;
            }, {}));
        }
        else {
            setCityTwo(value);
            cityOne && setTempData(Object.keys(city_temp_cache).reduce((acc, cur) => {
                if (cur === value || cur === cityOne) acc[cur] = city_temp_cache[cur];
                return acc;
            }, {}));
        }
        console.log(cityOne, cityTwo);
    }

    return (
        <div>
            <button onClick={() => setComparisonChartShow(true)}>Click here to view Temperature Comparison Graph</button>
            {tempData &&
                <>
                    {/* <button onClick={defaultGraphClickHandler}>Default Graph</button> */}
                    {CITY_DATA.map(val =>
                        <FormControlLabel
                            control={
                                <Checkbox checked={tempData.hasOwnProperty(val)} onChange={() => handleCheckboxChange(val)} name="gilad" />
                            }
                            label={val}
                        />
                    )}
                    {/* <div>
                        <span>You can also do comparison of two cities</span>
                        <FormControl style={{ width: "200px", margin: "20px" }}>
                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={cityOne}
                                label="City 1"
                                onChange={(e) => cityChangeHandler("city1", e.target.value)}
                                style={{ width: "200px" }}
                            >
                                {CITY_DATA.map((val, index) => <MenuItem key={index} value={val}>{val}</MenuItem>)}
                            </Select>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={cityTwo}
                                label="City 2"
                                onChange={(e) => cityChangeHandler("city2", e.target.value)}
                                style={{ width: "200px" }}
                            >
                                {CITY_DATA.map((val, index) => <MenuItem key={index} value={val}>{val}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div> */}
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: Object.keys(tempData) }]}
                        series={[{ data: Object.values(tempData), color: "#ffcc00" }]}
                        width={500}
                        height={300}
                        {...chartSetting}
                    />
                </>
            }
        </div>
    )
}

export default ComparisonChart