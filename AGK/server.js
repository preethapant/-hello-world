
//server acts as a middle man
var express = require('express'); //initializes express to set up web server
var myParser = require("body-parser"); //initializes body-parser to set up web server
var filename = 'user_data.json' //Defines the user_data.json array as an object
var app = express(); //Executes Express


fs = require('fs'); //Use the file system module 
app.use(myParser.urlencoded({ extended: true }));
//returns a boolean (true or false) (Opens file only if it exists)
if (fs.existsSync(filename)) {
  stats = fs.statSync(filename) //gets the stats of your file


  data = fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.
  users_reg_data = JSON.parse(data); //Parses data in order to turn string into an object
}





//GETS TO POINTS PAGE


// Process login form POST and redirect to Total Points Page. If incorrect login info is inputted, show error
app.post("/gen_login.html", function (request, response) {
  the_username = request.body.username; //makes username 
  //Validate login data
  if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
    if (users_reg_data[the_username].password == request.body.password) {

      response.redirect('/gen_ptpg.html?' + `&username=${the_username}`); //Adds username to Total Points Page
    }

    else {
      response.send('Invalid Login: Please hit the back button and try again'); //if password isn't equal to password existing in jsonn data, show error message

    }


  }

});



app.post("/eb_login.html", function (request, response) {
  the_username = request.body.username; //makes username 
  //Validate login data
  if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
    if (users_reg_data[the_username].password == request.body.password) {

      response.redirect('/eb_mainpg.html?' + `&username=${the_username}`); //Adds username to Total Points Page
    }

    else {
      response.send('Invalid Login: Please hit the back button and try again'); //if password isn't equal to password existing in jsonn data, show error message

    }


  }

});


//DISPLAY GK MEMBER LIST
app.post("/eb_gklist.html", function (request, response) {
  the_username = request.body.username; //makes username 
response.send(users_reg_data);

 //response.send(users_reg_data.username); //Attempt to get only usernames to show up but i is not defined
// response.send (users_reg_data[the_username].email}; attempt to get emails but nothing shows up
//response.send(users_reg_data.password); Doesn't work
//response.send(users_reg_data['itm352'].password); //We only can retrieve the password from a specific user rather than all users
// How to format using server????
});






app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
  next(); //calls the middleware function
});
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080