var express = require('express');
var app = express();
var myParser = require("body-parser");//respond to POST method, data is not put in query string 

app.use(myParser.urlencoded({ extended: true }));
fs = require('fs');
var filename = 'user_data.json';
//find a way to sisplay the data if it is in the additional file, if not display an error message
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(filename + 'has'+ "" + stats.size + 'characters');//display the number of charaters in the data
    data = fs.readFileSync(filename, 'utf-8');//utf-8 defines the coding of the file, readFileSync used to run a part of file and execute it before running the rest of the file  
    console.log(typeof data);
    user_reg_data = JSON.parse(data);//creates a displayable log of the data
/*
username = 'newuser';
user_reg_data[username] = {};
user_reg_data[username].password = 'newpass';
user_reg_data[username].email = 'newuser@user.com';
fs.writeFileSync(filename,JSON.stringify(user_reg_data));//add the info of new user in the user_data.json 
*/
    console.log(user_reg_data);
} else { console.log(filename + 'does not exist') };


app.get("/login", function (request, response) {//Show login page
    // Give a simple login form
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

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    the_username = request.body.username;
    if (typeof user_reg_data[the_username] != 'undefined') {
        if (user_reg_data[the_username].password == request.body.password) { response.send(the_username + ' login') } 
        else {
            response.redirect('/login')
        }
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="" method="POST">
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

    //save data if registration checks out

 username = request.body.username;
user_reg_data[username] = {};
user_reg_data[username].password = request.body.password;
user_reg_data[username].email = request.body.email;
//turns into string
fs.writeFileSync(filename,JSON.stringify(user_reg_data));

respond.send(`${username} registered!`)
    
 });
app.listen(8080, () => console.log(`listening on port 8080`));