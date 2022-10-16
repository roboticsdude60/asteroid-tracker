const canvas = document.getElementById("myCanvas");
canvas.width = visualViewport.width;
canvas.height = 300;
const centerCrossAxis = canvas.height / 2;

function drawEarth() {
  const ctx = canvas.getContext("2d");
  // draw earth
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-80, centerCrossAxis, 200, 0, 2 * Math.PI);
  ctx.fill();
  // label earth
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Earth", 20, centerCrossAxis);
}

// give me the lunar miss distance
// and the average of the estimated_diameter_min and estimated_diameter_max in kilometers
function drawAsteroid(asteroid) {
  const ctx = canvas.getContext("2d");
  const r = Math.max(
    (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) * 10,
    1
  );
  const distanceMainAxis = asteroid.miss_distance * 3;
  ctx.fillStyle = "black";
  ctx.beginPath();

  ctx.arc(distanceMainAxis, centerCrossAxis, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = "8px Arial";
  ctx.fillText(name, distanceMainAxis + r + 10, centerCrossAxis - r);
}

drawEarth();
drawAsteroid("465633 (2009 JR5)", 117.7689258646, 0.2251930467);
drawAsteroid("(2020 WZ)", 179.797103928, 0.0110803882);

/*
API format:
https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
START_DATE: YYYY-MM-DD
END_DATE: YYYY-MM-DD
API_KEY: JomaPZShT3jY2Bww2JRw79EuofjA8TW3CldDLJdl
*/

let asteroidAPIURL = "";

// function getAsteroidsThisWeek() {
//   const today = new Date();
//   const endDate = new Date();
//   endDate.setTime(today.getTime());

//   console.log(endDate);

//   const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
//   endDate.setTime(endDate.getTime() + oneWeekInMillis);

//   const startDateFormat =
//     today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
//   const endDateFormat =
//     endDate.getFullYear() +
//     "-" +
//     (endDate.getMonth() + 1) +
//     "-" +
//     endDate.getDate();
//   document.getElementById("date_form").elements[0].value = startDateFormat;
//   document.getElementById("date_form").elements[1].value = endDateFormat;
//   getAsteroidData(startDateFormat, endDateFormat);
// }

function getAsteroidAPIURL() {
  let start_date = document.getElementById("startDate").value;
  let end_date = document.getElementById("endDate").value;
  console.log(start_date, end_date);

  const regex =
    /^\d{4}-(((0[1-9])|(1[0-2])))-((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))$/;
  if (regex.test(start_date) == false || regex.test(end_date) == false) {
    console.log("START_DATE or END_DATE is not formatted in YYYY-MM-DD format");
    start_date = "2000-05-05";
    end_date = "2000-05-06";
  }
  return makeURL(start_date, end_date);
}

function makeURL(start_date, end_date) {
  const apiKey = "JomaPZShT3jY2Bww2JRw79EuofjA8TW3CldDLJdl";
  return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}`;
}

async function getAsteroidData(event) {
  // otherwise submitting the form makes the whole page refresh
  event.preventDefault();

  const url = getAsteroidAPIURL();
  console.log(url);
  fetch(url)
    .then(function (response) {
      if (response.status != 200) {
        console.log("Error when fetching: " + response.statusText);
        throw response;
      } else {
        console.log(response.text());
        return response.json();
      }
    })
    .then(function (json) {
      const asteroids = organizeAsteroidData(json);
      asteroids.forEach((asteroid) => {
        drawAsteroid(asteroid.name, asteroid);
      });
    });
}

/*
Will organize all the data from the json to:

{
name: string
estimated_diameter_min: float(km)
estimated_diameter_max: float(km)
is_potentially_hazardous_asteroid: boolean
miss_distance: float (lunar)
relative_velocity: float(km/sec)
//what else do we want?
}
*/

function organizeAsteroidData(json_data) {
  console.log(`organizing asteroid data`);
  let near_earth_objects = [];
  const keys = Object.keys(json_data.near_earth_objects);
  keys.forEach((key) => {
    near_earth_objects = [
      ...near_earth_objects,
      ...json_data.near_earth_objects[key],
    ];
  });

  const asteroids = near_earth_objects.map((object) => ({
    name: object.name,
    estimated_diameter_min:
      object.estimated_diameter.kilometers.estimated_diameter_min,
    estimated_diameter_max:
      object.estimated_diameter.kilometers.estimated_diameter_max,
    is_potentially_hazardous_asteroid: object.is_potentially_hazardous_asteroid,
    miss_distance: object.close_approach_data[0].miss_distance.lunar,
    relative_velocity:
      object.close_approach_data[0].relative_velocity.kilometers_per_second,
  }));
  console.log(asteroids);
  return asteroids;
}

// getAsteroidsThisWeek();

document.getElementById("submit").addEventListener("click", getAsteroidData);
