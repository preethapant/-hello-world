
//Ex2
/* attributes = 'Preetha', 20, 20.5,-19.5;
theSeperator = ';';
parts = attributes.split(theSeperator);
console.log(parts);*/

//Ex3
/*
var attributes = "Preetha ;20;20.5;-19.5";
var theSeparator = ';';
var parts = attributes.split(theSeparator);

for (i = 0; i < parts.length; i++) {
    console.log(typeof parts[i]);
}
console.log(parts.join(theSeparator));
*/

//Ex 4
/*
attributes = "Preetha ;20;20.5;-19.5";
theSeparator = ';';
parts = attributes.split(theSeparator);
for(i = 0; i < parts.length; i++){
    console.log(`${parts[i]} isNonNegInt ${isNonNegInt(parts[i], true)}`);
}
console.log(parts.join(theSeparator));*/

    /*Part A
function isNonNegInt(q) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    //console.log('Hey!' + q);
    return (errors.length == 0);
}
console.log(isNonNegInt());
console.log(isNonNegInt(-2));//returns false
console.log(isNonNegInt(2));//returns true

*/
/*
    //Part B
        function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    //console.log('Hey!' + q);
    return returnErrors ? errors : (errors.length == 0);
}
//console.log(isNonNegInt())*/

//Ex 5
attributes = "Preetha ;20;20.5;-19.5";
theSeparator = ';';
parts = attributes.split(theSeparator);
parts.forEach(function (item, index) {
    console.log((typeof item == 'string' && item.length > 0) ? true : false)
});

function printIt(item, Index) {
    console.log(`${item} isNonNegInt ${isNonNegInt(item, true)}`);
}
console.log(parts.join(theSeparator));

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    //console.log('Hey!' + q);
    return returnErrors ? errors : (errors.length == 0);
}
//console.log(isNonNegInt())

