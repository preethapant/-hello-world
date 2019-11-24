//PREETHA PANT, 11/26/19, creating own server to serve up our website
//Adapted from Lab 13
var express = require('express');// start express package to set up server
var app = express();//starts express
var myParser = require("body-parser");//start body-parser to set up server
var products = require('./public/product_data.js');//take data from product_data.js in the public folder
const querystring = require('querystring');//require that the server responds to any errors 


app.use(myParser.urlencoded({ extended: true }));
fs = require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var filename = 'user_registration_data.json';// storing the user_registration_data.json under the name filename

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//respond to HTTP request by sending type of request and the path of request
    next();//calls the middleware function
});

//Adapted from Lab 13
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    let POST = request.body; //
    var hasValidQuantities = true; //defining the hasValidQuantities variable and assuming all quantities are valid
    var hasPurchases = false; //assume the quantity of purchases are false
    for (i = 0; i < products.length; i++) { //for loop for each product array that increases the count by 1
        q = POST['quantity' + i]; //quantity entered by the user for a product is aessigned into q
        if (isNonNegInt(q) == false) { //if the quantity enetered by the user is invalid integer
            hasValidQuantities = false; //hasValidQuantities is false or nothing was inputed in the quantity textbox
        }
        if (q > 0) { //if quantity entered in the textbox is greater than 0
            hasPurchases = true; //if q is greater than 0 than the hasPurchases is ok
        }
    }
    //if data is valid give user an invoice, if not give them an error
    qString = querystring.stringify(POST); //string query together
    if (hasValidQuantities == true && hasPurchases == true) { //if both hasValidQuantities variable and hasPurchases variable are valid 
        response.redirect('./login_page.html?' + qString); //if quantity is valid it will send user to invoice
    }
    else {
        response.redirect("./products_page.html?" + qString); //if quantity is invalid it will send user back to products page
    }
});




    
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    the_username = request.body.username;
    if (typeof user_reg_data[the_username] != 'undefined') {
        if (user_reg_data[the_username].password == request.body.password) { response.send(the_username + ' login') } 
        else {
            response.redirect('/login')
        }
    };

// complicated HTML page to easy to read data, server linked to recieve requests from index page
app.use(myParser.urlencoded({ extended: true }));
//checks purchase submission, if good gives invoice or else referes back to order page
app.get("/process_form", function (request, response) {
    //checks if quantity is valid 
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
        console.log(has_errors,total_qty);
       
    //store the quanity query string on the server by making it a global vadiable
    //redirect to the login/registration page 
    //store the login/registration information on the server with a post method?
    //then redirect to the invoice with the quantity from the server
    //then say thank you username for your purchase on the invoice page 
       
       
       
        //request to view query string
        qstr = querystring.stringify(request.query);//turn object to query string
        // Now respond to errors or redirect to login if all is ok
        if (has_errors || total_qty == 0) {//check errors in total quantity
            response.redirect("products_page.html?" + qstr);//direct the page to products_page if errors in data entry
        } else { 
            response.redirect("login.html?" + qstr);// direct the page to login if no errors in data entry
        }
    }
});
//if quantity data valid, send them to the invoice 
app.use(express.static('./public'));//reffered to respond to GET, creates and launches a static web server 
app.listen(8080, () => console.log(`listening on port 8080`));//listen to port 8080

//Adapted from Lab 13
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(q==""){q=0;}
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); //include that if no amount is added the quantity is 0
}
