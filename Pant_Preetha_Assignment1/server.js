//PREETHA PANT, 11/26/19, creating own server to serve up our website
const querystring = require('querystring');//require that the server responds to any errors
var fs = require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module 
var express = require('express');// start express package to set up server
var myParser = require("body-parser");//start body-parser to set up server
var products = require('./public/product_data.js.js');//take data from product_data.js in the public folder
var qs = require('querystring');
//Adapted from Lab 13

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

var filename = 'user_data.json';// storing the user_data.json under the name filename

if (fs.statSync(filename)) {// load in users_reg_data from the json file
stats = fs.statSync(filename);
    
    console.log(filename); //returns user_data
    data = fs.readFileSync(filename, 'utf-8');//read the file synchronously until the file comes back
    users_reg_data = JSON.parse(data);//parses the data into JSON format
    console.log(users_reg_data); //console log output
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
app.post("/login.html", function (request, response) {
    //process login form POST and redirect to logged in page if ok, back to login page if not
    //if I have post, below will load
    console.log(user_product_quantities);
    //the_username =users_reg_data.username;
    the_username = request.body.username;
    console.log( "Username is", the_username);
    console.log(users_reg_data);
    //validate login data
    if (typeof users_reg_data[the_username] != 'undefined') { //data we loaded in the file
       if (users_reg_data[the_username].password == request.body.password) {
          //make the query string of product quantity needed for invoice
          theQuantQuerystring = qs.stringify(user_product_quantities);
          response.redirect('invoice.html?' + theQuantQuerystring + `&username=${the_username}`);
          //add their username in the invoice so that they know they're logged in (for personalization)
       } else {
          response.redirect('login.html'); //if username doesn't exist then return to login page 
          //make username sticky (i.e., stay in page when redirected)
          //NEED TO ADD MESSAGE ABOUT IF USERNAME AND PASSWORD ARE INCORRECT
       }
    }
 });
 
 app.post("/register.html", function (request, response) {
    let INFO = request.body;
    //Makes the username case-insensitive
    username = INFO.Username.toLowerCase();
    //Resest Errors in string so them dont carry over if user messes up multiple 
    //process a simple register form
 
    //validate registration data (add validation code for Assignment2)
    
    //validation includes # of characters, capitalization of letters, confirm password by typing it a second time (repeat_password)
    has_errors = false;
    //if all good, so save the new user, then redirect to invoice otherwise bounce back to register
 
    //do validation
    
    //need to validate username length + case sentsitivity
    //need to validate pass word lenght + one capital letter minimum + numbers  
       //make sure it matches what's in register.html
       //if can't figure out something, can always take it out of required field for password in register.html
    //need to validate passord_cofirmation is the same as password
    //need to validate email?
 
 
    if (has_errors == false) {
       // NEED TO save registration data to file
        //creates new user
        username = request.body.username;
        users_reg_data[username] = {};
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].name = request.body.name;
        users_reg_data[username].email = request.body.email;
     
        //turns into a json string file
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
       //I think he said I can use what's below but just changeg data in the pharanthesis ot something else but I forgot...
       //then change fs.readFileSync to fs.writeFileSync
       
       /*
       data = fs.readFileSync(filename, 'utf-8'); //read the file synchronously until the file comes back
       users_reg_data = JSON.parse(data) //will convert data (string) into an object or an array
       */
    
       //make the query string of product quantity needed for invoice
       theQuantQuerystring = qs.stringify(user_product_quantities);
       response.redirect('invoice.html?' + theQuantQuerystring + `&username=${username}`);
       //add their username in the invoice so that they know they're logged in (for personalization)
    } else {
       response.redirect('register.html'); //if username doesn't exist then return to registration page
       //NEED TO ADD MESSAGE ABOUT IF USERNAME AND PASSWORD ARE INCORRECT
    }
 });

app.use(express.static('./public')); //retrieves get request and look for file in public directory
app.listen(8080, () => console.log(`listening on port 8080`)); //the server listens on port 8080 and prints the message into the console