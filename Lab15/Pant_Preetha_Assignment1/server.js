//PREETHA PANT, 11/14/19, creating own server to serve up our website

const querystring = require('querystring');//require that the server responds to any errors in line 37
var products = require('./public/product_data.js');//take data from product_data.js in the public folder

//Adapted from Lab 13
var express = require('express');// start express package to set up server
var myParser = require("body-parser");//start body-parser to set up server

var app = express();//starts express
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//respond to HTTP request by sending type of request and the path of request
    next();//calls the middleware function
});
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
        //request to view query string
        qstr = querystring.stringify(request.query);//turn object to query string
        // Now respond to errors or redirect to invoice if all is ok
        if (has_errors || total_qty == 0) {//check errors in total quantity
            response.redirect("products_page.html?" + qstr);//direct the page to products_page if errors in data entry
        } else { 
            response.redirect("invoice.html?" + qstr);// direct the page to invoice if no errors in data entry
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
