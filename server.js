const http = require('http');
const port = process.env.port || 3000;
const web = require('./web');
const server = http.createServer(web);
server.listen(port);

console.log('Server started on port: '+ port);