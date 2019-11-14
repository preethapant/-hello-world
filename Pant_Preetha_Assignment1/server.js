//PREETHA PANT, 11/14/19, creating own server to serve up our website

//Adapted from Lab 13
const querystring = require('querystring');//require that the server responds to errors
var products = require('./public/product_data.js');//take data from product_data.js in the public folder

var express = require('express');// start express package to set up server
var myParser = require("body-parser");//start body-parser to set up server
var fs = require('fs');
var app = express();//starts express
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//respond to HTTP request by sending type of request and the path of request
    next();//calls the middleware function
});

app.use(myParser.urlencoded({ extended: true }));
//checks purchase submission, if good gives invoice or else referes back to order page
app.get("/process_form", function (request, response) {
    //checks if data is valid
    //finds request.query
    if (typeof params['purchase_submit'] != 'undefined') {
        has_errors = false; // assume quantities are valid from the start
        total_qty = 0; // need to check if something was selected so we will look if the total > 0
        for (i = 0; i < products.length; i++) {
            if (typeofparams[`quantity${i}`] != 'undefined') {
                a_qty = params.get[`quantity${i}`];
                total_qty += a_qty;
                if (!isNonNegInt(a_qty)) {
                    has_errors = true; // oops, invalid quantity
                }
            }
        }
        //request view query string
        qstr = querystring.stringify(request.query);//
        // Now respond to errors or redirect to invoice if all is ok
        if (has_errors || total_qty == 0) {
            //if quantity data is not valid, send them back to product display
            qstr = querystring.stringify(request.query);
            response.redirect("product_page.html?" + qstr);
        } else { // all good to go!
            response.redirect("invoice.html?" + qstr);
        }
    }
});
//if quantity data valid, send them to the invoice 
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Adapted from Lab 13
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}
