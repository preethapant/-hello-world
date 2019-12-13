//server acts as a middle man

var express = require('express'); //initializes express to set up web server

var app = express(); //Executes Express



app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
    next(); //calls the middleware function
 });
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080