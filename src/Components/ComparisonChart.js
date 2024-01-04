import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { getWeatherCurrentDataAPiUrl } from "../utils/constants";
import { CITY_DATA } from "../utils/constants";

import "./ComparisonChart.css";

const city_temp_cache = {};
const chartSetting = {
  yAxis: [
    {
      label: "Temp °C",
    },
  ],
};
const ComparisonChart = ({ cache }) => {
  const [isComparisonChartShow, setComparisonChartShow] = useState();
  const [tempData, setTempData] = useState();
  const [isError, setIsError] = useState();
  const [isLoading, setIsLoading] = useState();

  const handleCheckboxChange = (checkboxName) => {
    if (tempData.hasOwnProperty(checkboxName)) {
      if (Object.keys(tempData).length === 2) {
        setIsError(true);
        setTimeout(() => setIsError(false), 3000);
        return;
      }
      let temp = { ...tempData };
      delete temp[checkboxName];
      setTempData(temp);
    } else {
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
    async function getWeatherCurrentData() {
      setIsLoading(true);
      let temp = [];
      CITY_DATA.map((val) => {
        if (!cache.hasOwnProperty(val)) temp.push(val);
        else city_temp_cache[val] = cache[val].current.temp_c;
      });
      if (temp.length > 0) {
        const promises = temp.map((val) =>
          fetchData(getWeatherCurrentDataAPiUrl(val))
        );
        const results = await Promise.all(promises);
        results.map((val) => {
          city_temp_cache[val.location.name] = val.current.temp_c;
        });
        setTempData(Object.assign(city_temp_cache));
        setIsLoading(false);
      }
    }
    if (isComparisonChartShow) getWeatherCurrentData();
  }, [isComparisonChartShow]);

  return (
    <div className="temp-comparison-container">
      {isError && (
        <Alert
          variant="outlined"
          severity="error"
          style={{
            position: "absolute",
            right: "0",
            zIndex: "99",
            top: "10px",
          }}
        >
          There should be atleast two data for comparison!
        </Alert>
      )}
      <header>
        <span>Temperature Comparison Graph</span>
        <Button
          variant="contained"
          size="small"
          onClick={() => setComparisonChartShow(true)}
        >
          View
        </Button>
      </header>
      {isLoading && <CircularProgress />}
      <main>
        {tempData && (
          <>
            <div>
              {CITY_DATA.map((val, i) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempData.hasOwnProperty(val)}
                      onChange={() => handleCheckboxChange(val)}
                      name="gilad"
                    />
                  }
                  label={val}
                  key={i}
                />
              ))}
            </div>
            <BarChart
              xAxis={[{ scaleType: "band", data: Object.keys(tempData) }]}
              series={[{ data: Object.values(tempData), color: "#ffcc00" }]}
              height={300}
              {...chartSetting}
              className="bar-chart"
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ComparisonChart;
