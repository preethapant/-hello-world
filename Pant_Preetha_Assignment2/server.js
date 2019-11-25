//PREETHA PANT, 11/26/19, creating own server to serve up our website
//Adapted from Lab 13
var express = require('express');// start express package to set up server
var app = express();//starts express
var myParser = require("body-parser");//start body-parser to set up server
var products = require('./public/product_data.js');//take data from product_data.js in the public folder
const querystring = require('querystring');//require that the server responds to any errors 
var filename = 'user_data.json';// storing the user_data.json under the name filename
var fs = require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module 
//Adapted from Lab 13
//returning errors check in the value being added to the products
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(q==""){q=0;}//checks to see whether or not the quantity is 0
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push(' Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); //include that if no amount is added the quantity is 0
}
//Adapted from Lab 14
//check to see if the file exists. if it does, read it and parse it. if not output a message
if (fs.statSync(filename)) {

    //returns contents of the path
    data = fs.readFileSync(filename, 'utf-8');

    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters');//logging the amount of characters in each file on the console
    users_reg_data = JSON.parse(data);//parses the data into JSON format
    /*
    username = 'newuser';
    users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));
    */

    console.log(users_reg_data); //console logs

} else {
    console.log(filename + ' does not exist');
}

//Adapted from Lab 14
app.use(myParser.urlencoded({ extended: true }));

var filename = 'user_data.json';// storing the user_data.json under the name filename

//Adapted from Lab 13
//loging the method and path displayed in the console

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//respond to HTTP request by sending type of request and the path of request
    next();//calls the middleware function
});

//Adapted from Lab 13
//posts the process form data with the action as process_form
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
            response.redirect("login.html?" + qstr);// direct the page to invoice if no errors in data entry
        }
    }
});
app.post("/process_form", function (request, response) {
    let POST = request.body;
    var hasValidQuantities = true; //action taken given that the quantities textbox is true
    var hasPurchases = false; //action taken given the quantity of purchases are false
    for (i = 0; i < products.length; i++) { //for loop for each product in the array that increases the count by 1
        q = POST['quantity' + i]; //quantity entered by the user for a product(s) is assigned into q
        if (isNonNegInt(q) == false) { //if the quantity enteredby the user is not a valid integer
            hasValidQuantities = false; //HasValidQuantities is false or nothing was purchased
        }
        if (q > 0) { //if the quantity entered is more than 0
            hasPurchases = true; //hasPurchases is true and the user has entered a valid integer(s) to purchase something
        }
    }
    //if data is valid give user an invoice, if not give them an error
    var qString = querystring.stringify(POST); //string query together
    if (hasValidQuantities == true && hasPurchases == true) {//if hasValidQuantities and hasPurchases is true
        response.redirect('login.html?' + qString);
    }
    else {

        response.redirect("./products_page.html?" + qString); //if quantity is not valid, user is sent back to product page along with the query data entered previously from the user
    }

});



//Got from Lab14
//gets called with data from the form
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    var qString = querystring.stringify(request.query);
    inputUser = request.body.username;
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); //give me username from object and assigning it
    if (typeof users_reg_data[the_username] != 'undefined') { //ask object if it has property called username, if it does, it wont be udefined. check to see if it exists
        if (users_reg_data[the_username].password == request.body.password) {//check if the password they entered matches what was stored
            //passes the username + the string logged in on the page to greet them
           
            //request.query.InvoiceName = users_reg_data[the_username].name;
            presentFullName = users_reg_data[the_username].name;
            stickPut = presentFullName;
            request.query.stickMe2 = stickPut; 
            qString = querystring.stringify(request.query);
            response.redirect("./invoice.html?" + qString);//if the quantity is valid, user is directed to invoice along with the query data from the form
            
        } else if (users_reg_data[the_username].password != request.body.password) {
            error = "Incorrect Password";
            stickInput = inputUser;//if they did not login successfully, does another get request and redirects user to login to page
            
        }
    } else {
        error = the_username + "is not registered";
        stickInput = inputUser;
    }
    request.query.LoginError = error;
    request.query.stickies = stickInput;
    qString = querystring.stringify(request.query);
    response.redirect("./login.html?" + qString);



});  
  

app.post("/register", function (request, response) {
    // process a simple register form

    //validate registration data

    //all good, so save new user to the file name(registration data)
    username = 'newuser';
    username = request.body.username;

    if (typeof users_reg_data[username] != 'undefined') {//check if the password they entered matches what was stored
        response.redirect('./login.html?' + qString);//if they did not login successfully, does another get request and redirects user to login to page
        //can regnerate form here and display errors
    } else if (request.body.repeat_password != request.body.password) {
        response.send(`password does not match`);
    } else {
        users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
        //alert(`${username} registered!`)
        response.redirect("./invoice.html?" + qString);
        //response.redirect ("./invoice.html?" + qString );//if the quantity is valid, user is directed to invoice along with the query data from the form

        console.log(request.body);
    }

});
app.use(express.static('./public')); //retrieves get request and look for file in public directory
app.listen(8080, () => console.log(`listening on port 8080`)); //the server listens on port 8080 and prints the message into the console