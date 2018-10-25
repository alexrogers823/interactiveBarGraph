const dataset = [];
let categoryLabels;

// Array of JSON data with Category data
const requestSites = [
  'https://raw.githubusercontent.com/alexrogers823/interactiveBarGraph/master/month_expenses_2016.json',
  'https://gist.githubusercontent.com/alexrogers823/73335d86e2516993face9f7818bd9955/raw/89fa5fb90db60ff0949fd8af2d629b39d47d9dc6/barGraphCategories.json'];

function fetchData(url) {
  return fetch(url).then(blob => blob.json());
}

const arrayOfPromises = requestSites.map(site => fetchData(site));
Promise.all(arrayOfPromises)
  .then(arrayOfResults => {
    console.log(arrayOfResults);
    dataset.push(...arrayOfResults[0]);
    categoryLabels = arrayOfResults[1];
  })
  .then(() => {
    // Set all dependant variables after resolved promise
    categoryLength = Object.keys(categoryLabels).length;
    xDistance = (width - moveX)/categoryLength;

    categoryScale = d3.scale.linear()
      .domain([0, categoryLength])
      .range([0, width - moveX]); //moveX + yAxis distance

    categoryAxis = d3.svg.axis()
      .ticks(categoryLength+1)
      .tickSize(2)
      .tickPadding(60)
      .scale(categoryScale)
      .tickFormat((d, i) => createCategoryNames(d, i))
      .orient("bottom");

    // Calling the categorical axis
    svgContainer.append("g")
      .attr("class", "categoryAxis")
      .attr("transform", `translate(${moveX/2}, ${height+5})`)
      .call(categoryAxis)
      .selectAll("text")
      .attr("transform", "rotate(45)");
  });

// Makes category names for ticks in Axis
function createCategoryNames(d, i) {
  let categoryNames = ["."];
  for (let prop in categoryLabels) {
    categoryNames.push(prop);
  }
  return categoryNames[i];
}


// Category labels. Find a way to add directly from month expenses data

// Scales and Axis (eventually use band scale for y-axis)
const width = 1100;
const height = 450;
let categoryLength;
const moveX = 40;
let xDistance;
const barWidth = 30;

const heightScale = d3.scale.linear()
  .domain([0, 1050])
  .range([0, height]);

const reverseHeightScale = d3.scale.linear()
  .domain([0, 1050])
  .range([height, 0]);

// const categoryScale = d3.scale.ordinal()
//   .domain(d3.range(categoryLength))
//   .rangeRoundBands([0, width], .1);

let categoryScale;

const axis = d3.svg.axis()
  .ticks(20)
  .tickSize(5)
  .tickPadding(5)
  .scale(reverseHeightScale)
  .orient("left");

let categoryAxis;

// set variable for smooth transition
const t = d3.transition().duration(750);


// Without d3.json import
const svgContainer = d3.select("section").append("svg")
.attr("class", "background")
.attr("width", width)
.attr("height", height+100)
.append("g")
.attr("class", "content")
.attr("transform", `translate(${moveX}, -10)`);
// .call(axis);

const marginSpace = 10;


function processData(data, number) {
  let obj = data[0][`month${number}`].Expenses;
  let newDataSet = [];
  // console.log(obj);
  let totalValue = 0, totalExpenses = 0;

  for (let prop in categoryLabels) {
    let value = 0;
    for (let i = 0; i < obj.length; i++) {
      // Using only one property so that totalExpenses variable is done correctly
      if (prop === "Rent") {
        totalExpenses += obj[i].Cost;
      }
      if (categoryLabels[prop] !== "Other" && (categoryLabels[prop].labels.includes(obj[i].Category) || obj[i].Category === prop)) {
        value += obj[i].Cost;
        totalValue += obj[i].Cost;
      }
    }
    newDataSet.push({Expense: prop, Cost: value, Goal: categoryLabels[prop].goal, Color: categoryLabels[prop].color});
  }

  // Setting the "other" category from leftover totalValue
  newDataSet[newDataSet.length-1] = {Expense: "Other", Cost: totalExpenses - totalValue, Goal: categoryLabels["Other"].goal, Color: categoryLabels["Other"].color};

  // console.log(newDataSet)
  return newDataSet;
}

// function to set colors for bars
function colorBars(ht, goal, colors, i) {
  if (goal && ht > goal) {
    return 'rgb(200, 0, 0)';
  }
  let shade = (goal) ? ht/goal : 1;
  let red = colors[0], green = colors[1], blue = colors[2];
  return `rgb(${red*shade}, ${green*shade}, ${blue*shade})`;
}


// Set function to update with new data
function update(data, number) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  // Rectangles using data
  const otherRectangles = svgContainer.selectAll(".bar")
  .data(processData(data, number));

  // Updating month title
  document.querySelector("span").textContent = `${monthNames[number-1]}`;

  // Updating old elements that are present in new data
  otherRectangles.transition(t)
  .attr("x", (d, i) => categoryScale(i))
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", (d, i) => heightScale(d.Cost) + 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i));

  // Creating bars
  otherRectangles.enter()
  .append("rect")
  .attr("class", "bar")
  // .attr("x", (d, i) => i * xDistance)
  .attr("x", (d, i) => categoryScale(i))
  .attr("y", (d, i) => height - heightScale(d.Cost) + 1)
  .attr("width", barWidth)
  .attr("height", 0)
  .attr("fill-opacity", 0.1)
  .transition(t)
  .attr("fill-opacity", 1)
  .attr("fill", (d, i) => colorBars(d.Cost, d.Goal, d.Color, i))
  .attr("height", (d, i) => heightScale(d.Cost) + 1);

  // Creating goal lines
  otherRectangles.enter()
  .append("line")
  .attr("class", "goalLine")
  // .attr("x1", (d, i) => i * xDistance)
  .attr("x1", (d, i) => categoryScale(i))
  .attr("y1", d => (d.Goal) ? height - heightScale(d.Goal) : null)
  // .attr("x2", (d, i) => (i * xDistance) + barWidth)
  .attr("x2", (d, i) => categoryScale(i) + barWidth)
  .attr("y2", d => (d.Goal) ? height - heightScale(d.Goal) : null)
  .attr("stroke-dasharray", 3.2)
  .attr("stroke", d => (d.Cost > d.Goal) ? "white" : "black")
  .attr("opacity", 0.4);

}


// Calling the axis
svgContainer.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(-8, 3)`)
  .call(axis);


let pause = false;
// Changing the data each second
let numeric = 1;
setInterval(() => {
  if (!pause) {
    update(dataset, numeric);
    numeric++;
    if (numeric > 12) {
      numeric = 1;
    }
  }
}, 1500);


function showPause(e) {
  console.log(e);
}


const svg = document.querySelector("svg");
svg.onclick = e => {
  pause = !pause;
  // console.dir(e) //Find where offsetX and offsetY are and have dot
  showPause(e);
};
