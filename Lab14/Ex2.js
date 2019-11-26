fs=require('fs');//getting the component fs and loading it in and saving it in the module fs, because when you do a require it creates a module
var filename = 'user_data.json';// storing the user_data.json under the name filename
//find a way to sisplay the data if it is in the additional file, if not display an error message
if(fs.existsSync(filename)){
stats=fs.statSync(filename);
console.log(filename+'has'+stats.size +'characters');//display the number of charaters in the data
    data= fs.readFileSync(filename, 'utf-8');//utf-8 defines the coding of the file, readFileSync used to run a part of file and execute it before running the rest of the file  
console.log(typeof data);
user_reg_data= JSON.parse(data);// json.parse converts into and object
console.log(user_reg_data['itm352']);}else{console.log(filename+'does not exist')};//json. stringify turns it into json and prints if data exists otherwise an error message is given
