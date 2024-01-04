import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from "@mui/material";

import { CITY_DATA } from "./utils/constants";
import { DAY_DATA } from "./utils/constants";
import Chart from "./Chart";
import ComparisonChart from "./ComparisonChart";

import './App.css';

let cache = {};
function App() {
  const [city, setCity] = useState(CITY_DATA[0]);
  const [weatherDataOfCity, setWeatherDataOfCity] = useState();
  const [forecastDay, setForecastDay] = useState(0);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    const apiCall = async () => {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${city},India&days=7&hour=12&alerts=no&aqi=no&key=413473253f274b318b652628240401`);
      const data = await response.json();
      console.log(data);
      setWeatherDataOfCity(data);
      cache[city] = data;
    }
    apiCall();
  }, [city]);

  return (
    <div>
      <FormControl style={{ width: "200px", margin: "20px" }}>
        <InputLabel id="demo-simple-select-label">City</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={city}
          label="City"
          onChange={handleChange}
          style={{ width: "200px" }}
          defaultValue={city}
        >
          {CITY_DATA.map((val, index) => <MenuItem key={index} value={val}>{val}</MenuItem>)}
        </Select>
      </FormControl>
      <div>
        <img src={weatherDataOfCity?.current?.condition.icon} alt="weather_icon" />
        <span>{weatherDataOfCity?.forecast?.forecastday[forecastDay].day.avgtemp_c}</span><span>°C</span><span>|</span><span>°F</span>
        <div>
          <span>Precipitation: {weatherDataOfCity?.forecast?.forecastday[forecastDay].day.totalprecip_in}%</span>
          <span>Humidity: {weatherDataOfCity?.forecast?.forecastday[forecastDay].day.avghumidity}</span>
          <span>Wind {weatherDataOfCity?.forecast?.forecastday[forecastDay].day.maxwind_kph}km/h</span>
        </div>
        <div>
          <span>Weather</span>
          <span>{DAY_DATA[new Date(weatherDataOfCity?.forecast?.forecastday[forecastDay].date)?.getDay()]}</span>
          <span>{weatherDataOfCity?.forecast?.forecastday[forecastDay].day.condition.text}</span>
        </div>
      </div>
      {weatherDataOfCity &&
        <Chart weatherDataOfCity={weatherDataOfCity} />
      }
      <div style={{ display: "flex" }}>
        {new Array(7).fill(1).map((_, i) => (
          <div style={{ display: "flex", flexDirection: "column" }} onClick={() => setForecastDay(i)}>
            <span>{DAY_DATA[new Date(weatherDataOfCity?.forecast?.forecastday[i].date)?.getDay()]?.slice(0, 3)}</span>
            <img src={weatherDataOfCity?.forecast?.forecastday[i].day.condition.icon} alt="weather_icon" />
            <div>
              <span>{weatherDataOfCity?.forecast?.forecastday[i].day.maxtemp_c}°</span>
              <span>{weatherDataOfCity?.forecast?.forecastday[i].day.mintemp_c}°</span>
            </div>
          </div>
        ))}
      </div>
      <ComparisonChart cache={cache} />
    </div>
  );
}

export default App;
