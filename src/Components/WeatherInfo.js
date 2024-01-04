import { useState } from "react";
import { CircularProgress } from "@mui/material";

import Chart from "./Chart";
import { DAY_DATA } from "../utils/constants";
import { DAYS_TO_BE_FETCHED } from "../utils/constants";

import "./WeatherInfo.css";

const WeatherInfo = ({ weatherDataOfCity, isLoading }) => {
  const [forecastDay, setForecastDay] = useState(0);
  const [isTempratureInCelsius, setIsTempretureInCelsius] = useState(true);

  return (
    <div className="weather-info-main-container">
      {isLoading ? (
        <div style={{ position: "absolute", top: "40%", left: "30%" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <header>
            <div className="weather-info-sub-container">
              <img
                src={
                  weatherDataOfCity?.forecast?.forecastday[forecastDay].day
                    .condition.icon
                }
                alt="weather_icon"
              />
              <div className="current-temp-container">
                <span className="current-temp">
                  {Math.round(
                    weatherDataOfCity?.forecast?.forecastday[forecastDay].day[
                      isTempratureInCelsius ? "avgtemp_c" : "avgtemp_f"
                    ] || ""
                  )}
                </span>
                <span
                  className={`scaleCelcius ${
                    isTempratureInCelsius ? "selected" : ""
                  }`}
                  onClick={() => setIsTempretureInCelsius(true)}
                >
                  °C
                </span>
                <span>|</span>
                <span
                  className={`scaleFereinhit ${
                    isTempratureInCelsius ? "" : "selected"
                  }`}
                  onClick={() => setIsTempretureInCelsius(false)}
                >
                  °F
                </span>
              </div>
              <div className="weather-general-info">
                <span>
                  Precipitation:{" "}
                  {
                    weatherDataOfCity?.forecast?.forecastday[forecastDay].day
                      .totalprecip_in
                  }
                  %
                </span>
                <span>
                  Humidity:{" "}
                  {
                    weatherDataOfCity?.forecast?.forecastday[forecastDay].day
                      .avghumidity
                  }
                </span>
                <span>
                  Wind{" "}
                  {
                    weatherDataOfCity?.forecast?.forecastday[forecastDay].day
                      .maxwind_kph
                  }
                  km/h
                </span>
              </div>
            </div>
            <div className="weather-general-info_">
              <span className="weather-text">Weather</span>
              <span>
                {
                  DAY_DATA[
                    new Date(
                      weatherDataOfCity?.forecast?.forecastday[forecastDay].date
                    )?.getDay()
                  ]
                }
              </span>
              <span>
                {
                  weatherDataOfCity?.forecast?.forecastday[forecastDay].day
                    .condition.text
                }
              </span>
            </div>
          </header>
          {weatherDataOfCity && <Chart weatherDataOfCity={weatherDataOfCity} />}
          <div className="weather-future-forecast">
            {new Array(DAYS_TO_BE_FETCHED).fill(1).map((_, i) => (
              <div
                onClick={() => setForecastDay(i)}
                className={`box-containers ${
                  forecastDay === i ? "selected-box-container" : ""
                }`}
                key={i}
              >
                <span>
                  {DAY_DATA[
                    new Date(
                      weatherDataOfCity?.forecast?.forecastday[i].date
                    )?.getDay()
                  ]?.slice(0, 3)}
                </span>
                <img
                  src={
                    weatherDataOfCity?.forecast?.forecastday[i].day.condition
                      .icon
                  }
                  alt="weather_icon"
                />
                <div className="high-low-temp-details">
                  <span>
                    {weatherDataOfCity?.forecast?.forecastday[i].day.maxtemp_c}°
                  </span>
                  <span>
                    {weatherDataOfCity?.forecast?.forecastday[i].day.mintemp_c}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherInfo;
