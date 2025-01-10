import React, { useState } from "react";
import { css } from "@emotion/css";

import { fetchLastLocation } from "./backend/fetchLastLocations";

interface Result {
  timestamp: number;
  address: {
    street: string;
    city: string;
  };
  executionTime: number;
}

// This is an example results data structure
const results: Result[] = [
  {
    timestamp: Date.now(),
    address: {
      street: "5th Ave",
      city: "Random City",
    },
    executionTime: 900,
  },
  {
    timestamp: Date.now() + 2000,
    address: {
      street: "Main Road",
      city: "New Town",
    },
    executionTime: 400,
  },
];
const getStyles = () => ({
  button: css`
    border: 1px solid black;
    background: transparent;
    padding: 5px;
  `,
  container: css`
    margin: 10px;
  `,
});

function App() {
  const [responses, setResponses] = useState(results);

  const handleOnClick = async () => {
    const timestamp = Date.now();

    await fetchLastLocation().then((res) => {
      const executionTime = Date.now() - timestamp;
      setResponses((prev) => [...prev, { timestamp, executionTime, ...res }]);
    });
  };

  const s = getStyles();
  return (
    <div className={s.container}>
      <button className={s.button} onClick={() => handleOnClick()}>
        Get Last Location
      </button>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Street</th>
            <th>City</th>
            <th>Execution Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.timestamp}>
              <td>{new Date(response.timestamp).toLocaleString()}</td>
              <td>{response.address.street}</td>
              <td>{response.address.city}</td>
              <td>{response.executionTime} </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>Fastest: ms </div>
        <div>Slowest: ms </div>
        <div>Average: ms </div>
      </div>
    </div>
  );
}

export default App;
