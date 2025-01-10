import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";
import React from "react";

test("renders the table", () => {
  render(<App />);

  const tableElement = screen.getByRole("table");
  expect(tableElement).toBeInTheDocument();

  const headingElements = within(tableElement).getAllByRole("columnheader");
  expect(headingElements).toHaveLength(4);
  expect(headingElements[0]).toHaveTextContent("Timestamp");
  expect(headingElements[1]).toHaveTextContent("Street");
  expect(headingElements[2]).toHaveTextContent("City");
  expect(headingElements[3]).toHaveTextContent("Execution Time (ms)");
});

test("renders the button", () => {
  render(<App />);

  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveTextContent("Get Last Location");
});

test("renders the stats", () => {
  render(<App />);

  const fastestElement = screen.getByText(/^\w*Fastest:/);
  expect(fastestElement).toBeInTheDocument();

  const slowestElement = screen.getByText(/^\w*Slowest:/);
  expect(slowestElement).toBeInTheDocument();

  const averageElement = screen.getByText(/^\w*Average:/);
  expect(averageElement).toBeInTheDocument();
});

test("fetches data when button clicked", async () => {
  render(<App />);

  // Get the current row count
  const tableElement = screen.getByRole("table");
  const rows = within(tableElement).getAllByRole("row");

  // Click the button
  const buttonElement = screen.getByRole("button");
  await userEvent.click(buttonElement);

  // Expect the row count to increase by 1
  const newRows = within(tableElement).getAllByRole("row");
  expect(newRows).toHaveLength(rows.length + 1);

  // Expect the final row to be the loading message
  const finalRow = newRows[newRows.length - 1];
  expect(within(finalRow).getByText("Loading...")).toBeInTheDocument();

  // Wait for the loading element to no longer be displayed
  await waitForElementToBeRemoved(() =>
    within(finalRow).queryByText("Loading..."),
  );

  // Expect the final row to contain multiple columns with data
  const columns = within(finalRow).getAllByRole("cell");
  expect(columns).toHaveLength(4);
});
