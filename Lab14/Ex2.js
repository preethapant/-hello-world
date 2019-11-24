fs=require('fs');
var filename = 'user_data.json';
//find a way to sisplay the data if it is in the additional file, if not display an error message
if(fs.existsSync(filename)){
stats=fs.statSync(filename);
console.log(filename+'has'+stats.size +'characters');//display the number of charaters in the data
    data= fs.readFileSync(filename, 'utf-8');//utf-8 defines the coding of the file, readFileSync used to run a part of file and execute it before running the rest of the file  
console.log(typeof data);
user_reg_data= JSON.parse(data);//creates a displayable log of the data
console.log(user_reg_data['itm352']);}else{console.log(filename+'does not exist')};