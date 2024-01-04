export const CITY_DATA = ["Bangalore", "Chennai", "Kolkata", "Delhi", "Mumbai"];

export const DAY_DATA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const API_KEY = "413473253f274b318b652628240401";

export const DAYS_TO_BE_FETCHED = 7;

export const getWeatherForecastDataAPiUrl = (city) => {
  return `https://api.weatherapi.com/v1/forecast.json?q=${city},India&days=${DAYS_TO_BE_FETCHED}&hour=12&alerts=no&aqi=no&key=${API_KEY}`;
};

export const getWeatherCurrentDataAPiUrl = (val) => {
  return `https://api.weatherapi.com/v1/current.json?q=${val},India&key=${API_KEY}`;
};
