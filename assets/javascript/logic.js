var config = {
    apiKey: "AIzaSyD4WpXJE_OjEOIdB9pHDMGofStkUiENuGk",
    authDomain: "cryptoproject-e243e.firebaseapp.com",
    databaseURL: "https://cryptoproject-e243e.firebaseio.com",
    projectId: "cryptoproject-e243e",
    storageBucket: "cryptoproject-e243e.appspot.com",
    messagingSenderId: "754040931090"
};

firebase.initializeApp(config);
var database = firebase.database();
const txtEmail = document.getElementById("user");
const txtPassword = document.getElementById("pass");
const btnLogin = document.getElementById("login");
const btnSignUp = document.getElementById('signup');
const btnSignOut = document.getElementById('logout');


btnLogin.addEventListener('click', e => {
    e.preventDefault();
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

});
btnSignUp.addEventListener('click', e => {
    e.preventDefault();
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        .catch(e => console.log(e.message));
});
btnSignOut.addEventListener('click', e => {
    firebase.auth().signOut();
})
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser.uid);
        btnSignOut.classList.remove('invisible');
        // window.location = 'index.html';
        $("#loggedin").removeClass("invisible")
        $("#loggedout").empty()
        database.ref('users/' + firebaseUser.uid).set({
            ID: firebaseUser.uid,
            crypt: ""
        })
    } else {
        console.log("not logged in");
    }
});


btnSignOut.addEventListener('click', e => {
    firebase.auth().signOut(); {
        window.location = 'index.html';
    }
});
function submitButton() {
    console.log("we r inside")
    event.preventDefault();
    var submitID = $(this).attr('id');
    console.log(submitID)
    var amount = $("#" + submitID+"1").val().trim();
    console.log(amount)

    $("#"+ submitID).remove();
    $("#"+ submitID+"1").remove();

    $("#coinPrice > table:nth-child(1) > tbody > tr:nth-child(2) > td.coinAmmountInput"+submitID).append(`${amount}`);
}
 
var coinButtonArray = ["bitcoin", "litecoin", "ethereum", "cardano", "stellar", "neo"];



// var coinButtonArray = ["bitcoin", "litecoin", "ethereum", "cardano", "stellar", "neo", "decred", "ripple"];


// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}


function createButtons() {
    
    $("#coinPrice").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var queryURL = "https://api.coinmarketcap.com/v1/ticker/" + coinButtonArray[i] + "/";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                var colorPrice;
                var marketCap = abbrNum(response[0].market_cap_usd,3);
                var coinPrice = response[0].price_usd;
                var nameId = response[0].name;
                var priceChange = response[0].percent_change_24h;
                if (priceChange < 0) {
                    colorPrice = "redPrice"
                }else{
                    colorPrice = "greenPrice"
                }
                $("#cryptoSpace").append(`
                     <div class="col-md-6 col-lg-3">
                        <div class="card" data-name=${coinButtonArray[i]}>
                        <img class="card-img-top" src="http://via.placeholder.com/350x150" alt="Card image cap">
                        <div class="card-body">
                        <h5 class="card-title">${nameId}</h5>
                        <p class="card-text">Price: ${coinPrice}$</p>
                        <p class="card-text">MarketCap: ${marketCap}$</p>
                        <p class="card-text">24hr change:<span class="${colorPrice}"> ${priceChange} %</span></p>
                        <button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio">Add to Portfolio</button>
                    </div>
                </div>
            </div>
        `)

            });

    }
}


function displayCoin(name) {
    var coinName = $(this).attr("data-name");
    var queryURL = "https://api.coinmarketcap.com/v1/ticker/" + coinName + "/";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var coinRank = response[0].rank;
            var marketCap = response[0].market_cap_usd;
            var coinPrice = response[0].price_usd;

            console.log(response);
            console.log(firebase.auth().currentUser);

            database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).push({
                name: coinName
            })


        });
}
function displaySavedCoin(name) {
    var coinName = name;
    var queryURL = "https://api.coinmarketcap.com/v1/ticker/" + coinName + "/";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var coinRank = response[0].rank;
            var marketCap = response[0].market_cap_usd;
            var coinPrice = response[0].price_usd;
            $("#coinPrice").append(`<table style="width:100%">` +
                `<caption>` + coinName + `</caption>` +
                `<tr>` +
                `<th>` + 'Price In USD' + `</th>` +
                `<th>` + 'Market Cap' + `</th>` +

                `<th>` + 'Ammount' + `</th>` +
                `</tr>` +
                `<tr>` +
                `<td>` + coinPrice + `</td>` +
                `<td>` + marketCap + `</td>` +

                `<td class='coinAmmountInput${coinName}'><input type='text' name='ammount' id='${coinName}1'> <button class="submitButton btn btn-success float-right" id="${coinName}">submit</button></td>` +
                `</tr>` +
                `</table>`);

        })
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('child_added', function (snapshot) {
            console.log(snapshot.val().name);
            displaySavedCoin(snapshot.val().name);

        });
    }
});
$("#addCoin").on("click", function (event) {
    event.preventDefault();
    var coinName = $("#coinInput").val().trim();
    coinButtonArray.push(coinName);
    var buttonArr = $("<button class='btn btn-info'>");
    buttonArr.addClass("coinButtons");
    buttonArr.attr("data-name", coinName);
    buttonArr.text(coinName);
    $("#coinButtonView").append(buttonArr);
});
$(document).on("click", ".coinButtons", displayCoin);

$(document).on("click", ".submitButton", submitButton)
createButtons();

