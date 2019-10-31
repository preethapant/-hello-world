/*
var change = 175;//the change amounts to $1.75
var pennies = 1;//penny worth 1 cent
var nickles = 5;// nickle worth 5 cents
var dimes = 10;// dime worth 10 cents
var quarter = 25;// quarter worth 25 cents

step1 = change % quarter;//how many quarters go into $1.75
change = change - step1;//subtracting the number of quarters from the change
step2 = change % dimes;//dimes that are needed to fit the new change
change = change - step2;// subtracting the number of dimes from the change
step3 = change % nickles;//nickles that are needed to fit the new change
change = change - step3;// subtracting the number of nickles from the change
change = change;//show the rest of the pennies needed

console.log("number of quarters" + step1 + "number of dimes" + step2 + "number of nickles" + step3 +
 "number of pennies" + change);

*/

 // Coin values = [25, 10, 5, 1]

var changeDue = 175;

//Quarter function
function quarters() {
    var Qcount = 0;
    while (changeDue >= 25) {
        Qcount = Qcount + 1;
        changeDue = changeDue - 25;
    }
    console.log(`Quarters ` + Qcount);
}

//Dime function
function dimes() {
    var Dcount = 0;
    while (changeDue >= 10) {
        Dcount = Dcount + 1;
        changeDue = changeDue - 10;
    }
    console.log(`Dimes ` + Dcount);
}

//Nickel function
function nickels() {
    var Ncount = 0;
    while (changeDue >= 5) {
        Ncount = Ncount + 1;
        changeDue = changeDue - 5;
    }
    console.log(`Nickels ` + Ncount);
}

//Penny function
function pennies() {
    var Pcount = 0;
    while (changeDue >= 1) {
        Pcount = Pcount + 1;
        changeDue = changeDue - 1;
    }
    console.log(`Pennies ` + Pcount);
}

quarters();
dimes();
nickels();
pennies();