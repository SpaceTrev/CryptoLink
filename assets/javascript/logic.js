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


var coinButtonArray = ["bitcoin", "litecoin", "ethereum", "cardano", "stellar", "neo", "decred", "ripple"];


<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
function createButtons() {
    
    $("#coinPrice").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var queryURL = "https://api.coinmarketcap.com/v1/ticker/" + coinButtonArray[i] + "/";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                var marketCap = response[0].market_cap_usd;
                var coinPrice = response[0].price_usd;
                var nameId = response[0].name;
                $("#cryptoSpace").append(`
        <div class="col-md-6 col-lg-3">
            <div class="card" data-name=${coinButtonArray[i]}>
                <img class="card-img-top" src="http://via.placeholder.com/350x150" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${nameId}</h5>
                <p class="card-text">Price: ${coinPrice}</p>
                <p class="card-text">MarketCap: ${marketCap}</p>
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
createButtons();
