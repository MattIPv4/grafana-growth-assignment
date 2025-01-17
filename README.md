# Grafana Frontend React Exercise.

Thanks for taking your time to work on this with us!

## Instructions

> Note: We'll be using this as the base of your virtual on-site technical excercise. The on-site round will build on top of this assessment.

1. Clone this repository to your local.

2. Run `npm ci` to install all dependencies needed.

3. To start the project, run `npm start`. This runs the app in the development mode.

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

5. The repository comes with built in CSS using `emotions`. Feel free to use a different library if it is easier.

## Requirements

1. Clicking on the button should call fetch last location and display data in a new row in the table.

2. In the table, display a timestamp of the call, and the execution time of each call.

3. At the bottom, display the fastest time, slowest time, and average time

4. `App.tsx` comes with a fake endpoint called `fetchLastLocations`. Please do not modify the file `fetchLastLocations`.

5. Once completed, upload it to a repository and send the repository link back to your recruiter.

## Other things to consider

This exercise was meant as a very basic set up. We've got a few questions for you before you leave. Feel free to add to this read me and let us know here.

1. What can you do to improve it?
   - Replace react-scripts with custom webpack configuration
   - Replace react-scripts with direct Jest or Vitest configuration
   - Update testing-library dependencies
   - Update React version to v19
2. In the 1-2 hours time frame, what did you do to improve it?
   - Added prettier to consistently format code
   - Cleaned up dependencies
   - Added API schema checking + types for results
   - Stored full results in state instead of only most recent
   - Showed a visual indicator of a row loading (and failing to load)
   - Computed required stats for the requests (memoized for performance)
   - Added basic styling to the page
   - Wrote test suite for the page
3. Did you find any potential bugs?
   - Before adding types, the response state held an array initially and the only the last result on button click
