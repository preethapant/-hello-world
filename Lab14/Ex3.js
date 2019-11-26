var express = require('express');
var app = express();
var myParser = require("body-parser");//respond to POST method, data is not put in query string 

app.use(myParser.urlencoded({ extended: true }));
fs=require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var filename = 'user_data.json';// storing the user_data.json under the name filename
//find a way to display the data if it is in the additional file, if not display an error message
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(filename + 'has'+ "" + stats.size + 'characters');//display the number of charaters in the data
    data = fs.readFileSync(filename, 'utf-8');//utf-8 defines the coding of the file, readFileSync used to run a part of file and execute it before running the rest of the file  
    console.log(typeof data);
    user_reg_data = JSON.parse(data);// json.parse converts into and object
    console.log(user_reg_data['itm352']);
} else { console.log(filename + 'does not exist') };//json. stringify turns it into json and prints if data exists otherwise an error message is given


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

app.listen(8080, () => console.log(`listening on port 8080`));