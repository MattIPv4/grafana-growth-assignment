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

type Pending = { timestamp: number; state: "loading" | "failed" };

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

// TODO: Mobile:tm:
const styles = {
  container: css`
    align-items: start;
    display: flex;
    flex-flow: row nowrap;
    gap: 1em;
    margin: 1em;
  `,
  table: css`
    border-spacing: 0;
    flex: 1 1 auto;
  `,
  row: css`
    &:nth-child(even) {
      td {
        background: rgba(0, 0, 0, 0.05);
      }
    }

    th {
      border-bottom: 1px solid rgba(0, 0, 0, 0.75);
    }
  `,
  pending: css`
    font-style: italic;
    opacity: 0.5;
  `,
  button: css`
    border: 1px solid rgba(0, 0, 0, 0.75);
    background: transparent;
    padding: 0.25em;
  `,
  rail: css`
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 1em;
    position: sticky;
    top: 1em;
  `,
  stats: css`
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  `,
};

function App() {
  const [responses, setResponses] = useState<(Result | Pending)[]>(results);

  const handleOnClick = async () => {
    // Immediately store a loading state
    const timestamp = Date.now();
    let idx: number;
    setResponses((prev) => {
      idx = prev.length;
      return prev.concat({ timestamp, state: "loading" });
    });

    await fetchLastLocation()
      .then((res) => {
        // Enforce an API schema, throwing if not valid
        const parsed = LocationSchema.parse(res);

        // Replace the loading state with the actual result
        const executionTime = Date.now() - timestamp;
        setResponses((prev) => {
          const copy = prev.slice();
          copy[idx] = { ...parsed, timestamp, executionTime };
          return copy;
        });
      })
      .catch((err) => {
        // TODO: Track error in Sentry etc.?
        console.error(err);

        // Replace the loading state with a failed state
        setResponses((prev) => {
          const copy = prev.slice();
          copy[idx] = { timestamp, state: "failed" };
          return copy;
        });
      });
  };

  const stats = useMemo(() => {
    const executionTimes = responses.reduce((times, response) => {
      if (!("state" in response)) times.push(response.executionTime);
      return times;
    }, [] as number[]);
    const fastest = Math.min(...executionTimes);
    const slowest = Math.max(...executionTimes);
    const average =
      executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;

    return { fastest, slowest, average };
  }, [responses]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th>Timestamp</th>
            <th>Street</th>
            <th>City</th>
            <th>Execution Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.timestamp} className={styles.row}>
              {"state" in response ? (
                <td colSpan={4} className={styles.pending}>
                  {
                    {
                      loading: "Loading...",
                      failed: "Failed to fetch",
                    }[response.state]
                  }
                </td>
              ) : (
                <>
                  <td>{new Date(response.timestamp).toLocaleString()}</td>
                  <td>{response.address.street}</td>
                  <td>{response.address.city}</td>
                  <td>
                    {response.executionTime.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.rail}>
        <button className={styles.button} onClick={() => handleOnClick()}>
          Get Last Location
        </button>

        <div className={styles.stats}>
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
    </div>
  );
}

export default App;
