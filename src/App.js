import { useEffect, useState } from "react";

import ComparisonChart from "./Components/ComparisonChart";
import WeatherInfo from "./Components/WeatherInfo";
import { CITY_DATA } from "./utils/constants";
import { CitySelection } from "./Components/CitySelection";
import { getWeatherForecastDataAPiUrl } from "./utils/constants";

import "./App.css";

let cache = {};
function App() {
  const [city, setCity] = useState(CITY_DATA[0]);
  const [weatherDataOfCity, setWeatherDataOfCity] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const getWeatherData = async () => {
      setIsLoading(true);
      const response = await fetch(getWeatherForecastDataAPiUrl(city));
      const data = await response.json();
      setWeatherDataOfCity(data);
      cache[city] = data;
      setIsLoading(false);
    };
    getWeatherData();
  }, [city]);

  return (
    <>
      <CitySelection setCity={setCity} city={city} />
      <div className="main-container">
        <WeatherInfo
          weatherDataOfCity={weatherDataOfCity}
          isLoading={isLoading}
        />
        <ComparisonChart cache={cache} />
      </div>
    </>
  );
}

export default App;
