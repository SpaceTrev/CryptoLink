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
        btnSignOut.classList.remove('invisible');
        // window.location = 'index.html';
        $("#loggedin").removeClass("d-none")
        $("#loggedout").empty();
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
    var amount = $("#" + submitID + "1").val().trim();
    console.log(amount)
    $("#" + submitID).remove();
    $("#" + submitID + "1").remove();
    $("#coinPrice > table:nth-child(1) > tbody > tr:nth-child(2) > td.coinAmmountInput" + submitID).append(`${amount}`);
}

var coinButtonArray = ["BTC", "LTC", "ETH", "XRP", "XLM", "XRB", "NEO", "BCH"];

function createButtons() {

    $("#coinPrice").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinButtonArray[i] + "&tsyms=USD,EUR";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (data) {
                for (var name in data.DISPLAY) {
                    var colorPrice;
                    var marketCap = data.DISPLAY[name].USD.MKTCAP;
                    var coinPrice = data.DISPLAY[name].USD.PRICE;
                    var nameId = name;
                    var priceChange = data.DISPLAY[name].USD.CHANGEPCTDAY;
                    console.log(data.DISPLAY[name]);
                    console.log(marketCap);
                    console.log(coinPrice);
                    console.log(priceChange);
                  if (priceChange < 0) {
                        colorPrice = "redPrice"
                    } else {
                        colorPrice = "greenPrice"
                    }
                    $("#cryptoSpace").append(`

                     <div class="col-md-6 col-lg-3">
                        <div class="card">
                        <img class="card-img-top" src="http://via.placeholder.com/350x150" alt="Card image cap">
                        <div class="card-body">
                        <h5 class="card-title">${nameId}</h5>
                        <p class="card-text">Price: ${coinPrice}$</p>
                        <p class="card-text">MarketCap: ${marketCap}$</p>
                        <p class="card-text">24hr change:<span class="${colorPrice}"> ${priceChange} %</span></p>
                        <button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio" data-name='${nameId}'>Add to Portfolio</button>
                    </div>
                </div>
            </div>
        `)
                }
            });
    }
}

function createSavedButtons(name) {

    var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + name + "&tsyms=USD,EUR";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (data) {
            for (var name in data.DISPLAY) {
                var colorPrice;
                var marketCap = data.DISPLAY[name].USD.MKTCAP;
                var coinPrice = data.DISPLAY[name].USD.PRICE;
                var nameId = name;
                var priceChange = data.DISPLAY[name].USD.CHANGEPCTDAY;
                console.log(priceChange);
                if (priceChange < 0) {
                    colorPrice = "redPrice"
                } else {
                    colorPrice = "greenPrice"
                }
                $("tbody").append(`
                <tr>
                   <th scope="row">${nameId}</th>
                   <td>${coinPrice}</td>
                   <td>${marketCap}</td>
                   <td><input> <button class='btn btn-success'>Submit</button></input></td>
                   <td>To be Announced</td>
                   <td class="${colorPrice}">${priceChange}</td>
               </tr>
       
       `);
            }
        });

}

function coinToPortfolio(name) {
    var coinName = $(this).attr("data-name");

    database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).push({
        name: coinName
    })
}
function displaySavedCoin(name) {
    var coinName = name;
    var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinName + "&tsyms=USD,EUR";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (data) {
            var marketCap = data.DISPLAY[name].USD.MKTCAP;
            var coinPrice = data.DISPLAY[name].USD.PRICE;
            $("tbody").append(`
     <tr>
                   <th scope="row">${nameId}</th>
                   <td>${coinPrice}</td>
                   <td>${marketCap}</td>
                   <td><input> <button class='btn btn-success'>Submit</button></input></td>
                   <td>To be Announced</td>
                   <td class="${colorPrice}">${priceChange}</td>
     </tr>
   
   `);

        })
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('child_added', function (snapshot) {
            console.log(snapshot.val().name);
            createSavedButtons(snapshot.val().name);

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

$("#portfolio").on("click", function () {
    database.ref(`users/${user.uid}/cryptos`).on('child_added', function (snapshot) {
        console.log(snapshot.val().name);
        createSavedButtons(snapshot.val().name);

    });
})

// $(document).on("click", ".coinButtons", displayCoin);
$(document).on("click", "#addPortfolio", coinToPortfolio);
createButtons();
