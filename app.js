const http = require("http");
const router = require("./router.js");

http.createServer((req, res) => {
  // connect it to the main page here
  router.home(req, res);
}).listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000');
