var express = require('express');
var app = express();
var myParser = require("body-parser");
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');

app.use(session({ secret: "ITM352 rocks!" }));

app.use(myParser.urlencoded({ extended: true }));
var fs = require('fs');
var filename = 'user_data.json';

//check to see if the file exists. if it does, read it and parse it. if not output a message
if (fs.existsSync(filename)) {

    //returns contents of the path
    data = fs.readFileSync(filename, 'utf-8');

    stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats.size + ' characters'); //console logs the filename with the amount of characters it has

    users_reg_data = JSON.parse(data);//parses the data into JSON format

    username = 'newuser';
    users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    console.log(users_reg_data); //console logs

} else {
    console.log(filename + ' does not exist');
}

app.get("/set_cookie", function (request, response) {
    response.cookie('myname', 'Preetha Pant', { maxAge: 5 * 1000 }).send('cookie set');
});

app.get("/use_cookie", function (request, response) {
    output = "No cookie with myname";
    if (typeof request.cookies.myname != 'undefined') {
        output = `Welcome to the Use Cookie page ${request.cookies.myname}`;
    }
    response.send(output);
});

app.get('/use_session', function (request, response) {
    response.send(`Welcome, your session ID is ${request.session.id}`);
    request.session.destroy();
});

app.get("/login", function (request, response) {
    // Give a simple login form
    if (typeof request.cookies.username != 'undefined') {
        response.send(`Welcome back ${request.cookies.username}` + '<br>'
            + `You last logged in on ${request.session.last_login}`);
        return;
    }
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
});

//gets called with data from the form
app.post("/login", function (request, response) {

    // Process login form POST and redirect to logged when data checks out, if not return to lin page
    console.log(request.body);
    the_username = request.body.username; //give me username from object and assigning it
    if (typeof users_reg_data[the_username] != 'undefined') { //ask object if it has property called username, if it does, it wont be udefined. check to see if it exists
        if (users_reg_data[the_username].password == request.body.password) {//check if the password they entered matches what was stored
            msg = '';
            if (typeof request.session.last_login != 'undefined') {
                var msg = `You last logged in on ${request.session.last_login}`;
                var now = new Date();
            } else {
                now = 'First login!';
            }
            request.session.last_login = now;
            response
                .cookie('username', the_username, { maxAge: 500 * 1000 })
                .send(`${the_username} is logged in at ${now}`);
        } else {
            response.redirect('/login');//if they did not login successfully, does another get request and redirects user to login to page
            //can regnerate form here and display errors
        }
    }
});

app.get("/register", function (request, response) { //if server gets request to register
    // Give a simple register form
    //when submit, posts to register, then calls app.post
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter first name" ><br />
        <input type="text" name="username" size="40" placeholder="enter last name" ><br />
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    //validate registration data

    //all good, so save new user to the file name(registration data)
    username = 'newuser';
    username = request.body.username;

    if (typeof users_reg_data[username] != 'undefined') {//check if the password they entered matches what was stored
        response.redirect('/login');//if they did not login successfully, does another get request and redirects user to login to page
        //can regnerate form here and display errors
    } else if (request.body.repeat_password != request.body.password) {
        response.send(`password does not match`);
    } else {
        users_reg_data[username] = {}; //new user becomes new property of users_reg_data object
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
        response.send(`${username} registered!`)
        console.log(request.body);
    }
});

app.use(express.static('.'));
app.listen(8080, () => console.log(`listening on port 8080`));