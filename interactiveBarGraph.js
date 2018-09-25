// Using D3.js to show different changes in bar graph based on month

// will have mongoose imported along with d3
// will also play with idea of having this be an external sheet or in html internally

// Duration time will come later


// Connecting to and using mongoose
/* const express = require("express");
const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/month_expenses");
const db = mongoose.connection; */

// db.on("error", function(err) {
//   console.error("connection error:", err);
// });
//
// db.once("open", function(){
//   console.log("db connection successful");

// Getting data. First is just static example. Second will be JSON-driven
/* const dataset = [
  {exp: "Rent", cost: 10},
  {exp: "Apparel", cost: 25},
  {exp: "Utilities", cost: 15},
  {exp: "Groceries", cost: 40},
  {exp: "Subscriptions", cost: 25},
  {exp: "Travel", cost: 15},
  {exp: "Vehicle", cost: 30},
  {exp: "Other", cost: 35}
]; */

// const dataset = JSON.parse("month_expenses_2016.json");

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// document.querySelector('monthTitle').innerHTML = months[0] why isn't this working

// Once actual data is imported, start with this and indent everything else
// d3.json("month_expenses_2016.json", data => {
  // console.log(data);
    // Making the SVG container
const svgContainer = d3.select("body").append("svg")
.attr("width", 1000)
.attr("height", 550)
.append("g");

const marginSpace = 10;

  // // Set x and y axis
  // const x = d3.scale.ordinal().rangeRoundBands([0, 1000], 0.1);
  // const y = d3.scale.linear().range([550, 0]);
  // const xAxis = d3.svg.axis().scale(x).orient("bottom");
  // const yAxis = d3.svg.axis().scale(y).orient("left");
  // // Find out why axis isn't showing up
  // svgContainer.append("g")
  // .attr("class", "x-axis")
  // .attr("transform", "translate(0, 550)")
  // .call(xAxis);

// Rectangles using data
const otherRectangles = svgContainer.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class", "bar")
.attr("x", (d, i) => (i * 60) + 130)
// .attr("y", d => 550 - marginSpace - (d.Expenses.Cost * 10))
.attr("y", 400)
.attr("width", 50)
// .attr("height", d => d.Expenses.Cost * 10);
.attr("height", 100);
//Find out why text isn't showing up
// const text = svgContainer.selectAll(".bar")
// .data(data)
// .enter()
// .append("text")
// .attr("fill", "white")
// .attr("x", (d, i) => (i * 60) + 130 + 25)
// .attr("y", d => 525 - marginSpace)
// .text(d => d.exp);
// });




// Drawing a basic rectangle
const rectangle1 = svgContainer.append("rect")
                            .attr("x", 10)
                            .attr("y", 550 - marginSpace - 300)
                            .attr("width", 50)
                            .attr("height", 300);

const rectangle2 = svgContainer.append("rect")
                            .attr("x", 70)
                            .attr("y", 550 - marginSpace - 200)
                            .attr("width", 50)
                            .attr("height", 200);
