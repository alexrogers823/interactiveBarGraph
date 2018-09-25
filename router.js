const fs = require("fs");
const commonHeaders = {'Content-Type': 'text/html'};
const monthJSON = require("./month_expenses_2016.json");
// const interactiveBarGraph = require("./interactiveBarGraph.js");

function view(res) {
  let fileContents = fs.readFileSync("./interactiveBarGraph.html", {encoding: "utf8"});
  // fileContents = fileContents.replace("{{}}", monthJSON);
  res.write(fileContents);
  // fileContents = fs.readFileSync("./interactiveBarGraph.js", {encoding: "utf8"});
  // res.write(fileContents);
}

function home(req, res) {
  // When you're on home route
  if (req.url === "/") {
    if (req.method.toLowerCase() === "get") {
      res.writeHead(200, commonHeaders);
      view(res);
      res.end();
    }
  }

}

module.exports.home = home;
