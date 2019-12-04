//PREETHA PANT, 11/26/19, creating own server to serve up our website
const querystring = require('querystring');//require that the server responds to any errors
var fs = require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module 
var express = require('express');// start express package to set up server
var myParser = require("body-parser");//start body-parser to set up server
var products = require('./public/product_data.js');//take data from product_data.js in the public folder
var qs = require('querystring');
//Adapted from Lab 13


var filename = 'user_data.json';// storing the user_data.json under the name filename

if (fs.statSync(filename)) {// load in users_reg_data from the json file
  stats = fs.statSync(filename);


  data = fs.readFileSync(filename, 'utf-8');//read the file synchronously until the file comes back
  users_reg_data = JSON.parse(data);//parses the data into JSON format
  
  /*
  username = 'newuser';
  users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
  users_reg_data[username].password = 'newpass';
  users_reg_data[username].email = 'newuser@user.com';
  fs.writeFileSync(filename, JSON.stringify(users_reg_data));
  */



} else {
  console.log(filename + ' does not exist');
  //if file name does not exist, return this
  //ex:if we change var filename = 'user_data.json'; will return user_data.jsondoes not exist!
}




var app = express();//starts express
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);//respond to HTTP request by sending type of request and the path of request
  next();//calls the middleware function
});
var user_product_quantities = {};
app.get("/process_form", function (request, response) {
  //checks if quantity is valid
  user_product_quantities = request.query;
  //looks up a request.query
  var params = request.query;
  console.log(params);
  if (typeof params['purchase_submit'] != 'undefined') {
    has_errors = false; // assume quantities are valid from the start
    total_qty = 0; // need to check if something was selected so we will look if the total > 0
    for (i = 0; i < products.length; i++) {//checking each of the products in the array
      if (typeof params[`quantity${i}`] != 'undefined') {
        a_qty = params[`quantity${i}`];
        console.log(a_qty);
        total_qty += a_qty;//total quantity is addition of each individual quantity
        if (!isNonNegInt(a_qty)) {//checks for not nonnegInt
          has_errors = true; // oops, invalid quantity
        }
      }
    }
    console.log(has_errors, total_qty);
    //request to view query string
    qstr = querystring.stringify(request.query);//turn object to query string
    // Now respond to errors or redirect to invoice if all is ok
    if (has_errors || total_qty == 0) {//check errors in total quantity
      response.redirect("products_page.html?" + qstr);//direct the page to products_page if errors in data entry
    } else {
      response.redirect("login.html?" + qstr);// direct the page to invoice if no errors in data entry
    }
  }
});
//checking that data is valid
//borrowed code from Lab13/Assigment1
function isNonNegInt(q, returnErrors = false) {
  errors = []; // assume no errors at first
  if (q == "") { q = 0; }//checks to see whether or not the quantity is 0
  if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
  if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
  if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
  return returnErrors ? errors : (errors.length == 0); //include that if no amount is added the quantity is 0
}


//Adapted from Lab 14
//check to see if the file exists. if it does, read it and parse it. if not output a message
app.use(myParser.urlencoded({ extended: true }));

app.post("/login.html", function (request, response) {
  //process login form POST and redirect to logged in page if ok, back to login page if not
  //if I have post, below will load
  console.log(user_product_quantities);
  the_username = request.body.username;
  console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
  //validate login data
  if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
      if (users_reg_data[the_username].password == request.body.password) {
          //make the query string of product quantity needed for invoice
          theQuantQuerystring = qs.stringify(user_product_quantities);  //turns quantity object into a string
          response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`); //all good, send to invoice
      } else {
      error = "Invalid Password"; //if password does not exist, will show message (connected to login page)
  } 
  }
  else {
      error ="Username doesn't exist"; //Display error message showing the username doesn't exist
  }
  request.query.LoginError = error;
  request.query.StickyLoginUser = the_username;
  qstring = querystring.stringify(request.query);
  response.redirect('/login.html?error=' + error);//if username doesn't exist then return to login page (with alert box)
}
);

app.post("/register.html", function (request, response) {
  //process a simple register form
  console.log(user_product_quantities);

  //variable for re-enter password validation
  var p = request.body.password;
  var cp = request.body.repeat_password;

  username = request.body.username; //save new user to file name (users_reg_data)
  errors = {};//checks to see if username already exists
//username validation
if (typeof users_reg_data[username] != 'undefined'){
errors.username_error="Username is Already in Use"; //error message if username already exist (connected to registration page)
}
if ((/[a-z0-9]+/).test(request.body.username) == false){
  errors.username_error="Numbers and Letters only"; //error message if there are other special symbols other than numbers and symbols (connected to registration page)
}
if ((username.length > 10) == true){
  errors.username_error = "Characters for username is too long. Please enter 10 or fewer"; //error message if number of characters is longer than 10 (connected to registration page)
}
if ((username.length < 4) == true){
      errors.username_error = "Characters for username is too short. Please enter 4 or fewer"; //error message if number of characters is shorter than 4 (connected to registration page)
}


fullname = request.body.fullname;//save new user to file name (users_reg_data)

//fullname validation
if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false){
errors.fullname_error="Only use letters and add one space between first & last name"; //error message if special characters are used and/or a space is missing (connected to registration page)
}

if ((fullname.length > 30) == true){
  errors.fullname_error = "Full name is too long. Please make it fewer than 30 characters"; //error message if number of characters is longer than 30 (connected to registration page)
}

//email validation
email=request.body.email;
if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
errors.email_error="The email doesn't exist. Please enter a valid email"; //error message if proper email is not used (connected to registration page)
}

console.log(errors, users_reg_data);
//if there are 0 errors and repeat_password is equal to password, request all registration info
if ((Object.keys(errors).length == 0) & (p == cp)) {
    users_reg_data[username] = {};
    users_reg_data[username].username = request.body.username
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;
    users_reg_data[username].fullname = request.body.fullname;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //saves/writes registaration data into the user_data json file
    theQuantQuerystring = qs.stringify(user_product_quantities); //turns quantity object into a string
    response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //if all good, send to invoice
} else {
    qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
    response.redirect('/register.html?' + qstring); //if there are errors, send back to registration page to retype
}
request.query.LoginError = error;
  request.query.StickyLoginUser = the_username;
  qstring = querystring.stringify(request.query);
});

app.use(express.static('./public')); //retrieves get request and look for file in public directory
app.listen(8080, () => console.log(`listening on port 8080`)); //the server listens on port 8080 and prints the message into the console