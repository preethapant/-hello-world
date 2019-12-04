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
  the_username=request.body.username
  if (typeof users_reg_data[the_username] != 'undefined') {
    //Asking object if it has matching username, if it doesnt itll be undefined.
    if (users_reg_data[the_username].password == request.body.password) {
        //Diagnostic
        console.log("Successful login", request.query);
        //If login is vaild save name and data and send to invoice to make custom invoice, string is getting lost

        //Redirect them to invoice here if they logged in correctly
        //How do I take name from query and input into invoice???
        request.query.InvoiceName = users_reg_data[the_username].name;
        qstring = querystring.stringify(request.query);
        response.redirect("invoice.html?" + qstring);
    }
    error = "Invalid Password";
}
else {
    error = the_username + " Username does not exist";

}
//Give you error message alert if password or username is flawed.
request.query.LoginError = error;
//Used to make login sticky so you dont have to retype it everytime you get the password wrong
request.query.StickyLoginUser = the_username;
qstring = querystring.stringify(request.query);
response.redirect("login.html?" + qstring);
});


app.post("/registration", function (request, response) {
  
   username = request.body.username;//Save new user to file name (users_reg_data)
   errors = {};//Checks to see if username already exists
 //Username Validation
if (typeof users_reg_data[username] != 'undefined'){
errors.username_error="Username is currently in use"; 
}
if ((/[a-z0-9]+/).test(request.body.username) ==false){
   errors.username_error="Only numbers/letters";
}
if ((username.length > 10) ==true){
   errors.username_error = "Please make your username shorter"; 
}
if ((username.length < 4) ==true){
   errors.username_error = "Please make your username longer"; 
}


name = request.body.name;//Save new user to file name (users_reg_data)
//Fullname Validation //
if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false){
errors.fullname_error="Only use letters and a space";
}

if ((name.length > 30) ==true){
   errors.name_error = "Please make your full name shorter. 30 characters max"; 
}

//Email Validation//
email=request.body.email;
if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
errors.email_error="Please enter proper email";
}


console.log(errors, users_reg_data);
//If there are 0 errors, request all registration info
if (Object.keys(errors).length == 0){
   users_reg_data[username] = {};
   users_reg_data[username].username = request.body.username
   users_reg_data[username].password = request.body.password;
   users_reg_data[username].email = request.body.email;
   users_reg_data[username].fullname = request.body.fullname;

    //turns into a json string file
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
  

    //make the query string of product quantity needed for invoice
    theQuantQuerystring = qs.stringify(user_product_quantities);
    response.redirect('invoice.html?' + theQuantQuerystring + `&username=${username}`);
    //add their username in the invoice so that they know they're logged in (for personalization)
  } else {
    qstring= qs.stringify(request.body)+"&"+qs.stringify(errors);  
    response.redirect('register.html?'+qstring ); 
 
  }
});

app.use(express.static('./public')); //retrieves get request and look for file in public directory
app.listen(8080, () => console.log(`listening on port 8080`)); //the server listens on port 8080 and prints the message into the console