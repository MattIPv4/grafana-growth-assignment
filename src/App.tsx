import React, { useMemo, useState } from "react";
import { css } from "@emotion/css";
import z from "zod";

import { fetchLastLocation } from "./backend/fetchLastLocations";

const LocationSchema = z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
  }),
});

type Result = z.infer<typeof LocationSchema> & {
  timestamp: number;
  executionTime: number;
};

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

const styles = {
  button: css`
    border: 1px solid black;
    background: transparent;
    padding: 5px;
  `,
  container: css`
    margin: 10px;
  `,
} as const;

function App() {
  const [responses, setResponses] = useState(results);

  const handleOnClick = async () => {
    const timestamp = Date.now();

    await fetchLastLocation()
      .then((res) => {
        const parsed = LocationSchema.parse(res);
        const executionTime = Date.now() - timestamp;
        setResponses((prev) => [
          ...prev,
          { timestamp, executionTime, ...parsed },
        ]);
      })
      .catch((err) => {
        console.error(err);
        // TODO: Show user an error?
        // TODO: Track error in Sentry etc.?
      });
  };

  const stats = useMemo(() => {
    const executionTimes = responses.map((res) => res.executionTime);
    const fastest = Math.min(...executionTimes);
    const slowest = Math.max(...executionTimes);
    const average =
      executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;

    return { fastest, slowest, average };
  }, [responses]);

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => handleOnClick()}>
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
              <td>
                {response.executionTime.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div>
          Fastest:{" "}
          {stats.fastest.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
          ms
        </div>
        <div>
          Slowest:{" "}
          {stats.slowest.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
          ms
        </div>
        <div>
          Average:{" "}
          {stats.average.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
          ms
        </div>
      </div>
    </div>
  );
}

export default App;
