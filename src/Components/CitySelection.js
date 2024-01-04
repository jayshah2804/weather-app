import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormControl } from "@mui/material";

import { CITY_DATA } from "../utils/constants";
import logo from "../utils/app-logo.png";

export const CitySelection = ({ setCity, city }) => {
  return (
    <div>
      <div className="webpage-name">
        <img width={30} src={logo} />
        <div>
          <span style={{ fontSize: "22px" }}>Windy</span>
          <span>.com</span>
        </div>
      </div>
      <FormControl variant="standard" style={{ margin: "30px 60px" }}>
        <InputLabel id="demo-simple-select-label">City</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={city}
          label="City"
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "200px" }}
          defaultValue={city}
        >
          {CITY_DATA.map((val, index) => (
            <MenuItem key={index} value={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
