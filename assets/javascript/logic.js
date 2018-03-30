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

var coinButtonArray = ["BTC", "LTC", "ETH", "XRP", "XLM", "XRB", "NEO", "BCH"];

function createButtons() {

    $("#coinPrice").empty();
    $("#cryptoSpace").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinButtonArray[i] + "&tsyms=USD,EUR";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (data) {
                for (var name in data.DISPLAY) {
                    console.log(data)
                    var colorPrice;
                    var textColor;
                    var marketCap = data.DISPLAY[name].USD.MKTCAP;
                    var coinPrice = roundToTwo(data.RAW[name].USD.PRICE);
                    var nameId = name;
                    var priceChangePct = data.DISPLAY[name].USD.CHANGEPCT24HOUR;
                    var priceChange = data.DISPLAY[name].USD.CHANGE24HOUR;
                    var showBtn;
                    // console.log(cryptos);
                    if (checkIfinPortfolio(nameId)){
                        showBtn = `<button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio" data-name='${nameId}'>In Portfolio</button>`
                    }else{
                        showBtn = `<button class="btn btn-outline-success ml-2" type="submit" id="addPortfolio" data-name='${nameId}'>Add to Portfolio</button>`
                    }
                    console.log(data.DISPLAY[name]);
                    console.log(marketCap);
                    console.log(coinPrice);
                    console.log(priceChange);
                    if (priceChangePct < 0) {
                        colorPrice = "redPrice";
                        textColor = "redColor";
                    } else {
                        colorPrice = "greenPrice";
                        textColor = "greenColor";
                    }
                    $("#cryptoSpace").append(`

                     <div class="col-md-6 col-lg-3">
                        <div class="card">
                        <img class="card-img-top" src="http://via.placeholder.com/350x150" alt="Card image cap">
                        <div class="card-body">
                        <h5 class="card-title">${nameId}</h5>
                        <p class="card-text">Price: ${coinPrice}$</p>
                        <p class="card-text">MarketCap: ${marketCap}$</p>
                        <p class="card-text">24hr change:<span class="${colorPrice}"> ${priceChangePct}% </span>  <span class="${textColor}">${priceChange}$</span></p>

                       ${showBtn}
                    </div>
                </div>
            </div>
        `)
                }
            });
    }
}
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function createSavedButtons(name) {

    var queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + name + "&tsyms=USD,EUR";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (data) {
            
            var colorPrice;
            var textColor;
            var marketCap = data.DISPLAY[name].USD.MKTCAP;
            var coinPrice = data.DISPLAY[name].USD.PRICE;
            var nameId = name;
            var priceChangePct = data.DISPLAY[name].USD.CHANGEPCT24HOUR;
            var priceChange = data.DISPLAY[name].USD.CHANGE24HOUR;
            if (priceChangePct < 0) {
                colorPrice = "redPrice";
                textColor = "redColor";
            } else {
                colorPrice = "greenPrice"
                textColor = "greenColor";
            }
            $("tbody").append(`
                <tr>
                   <th scope="row">${nameId}</th>
                   <td>${coinPrice}</td>
                   <td>${marketCap}</td>
                   <td><input> <button class='btn btn-success'>Submit</button></input></td>
                   <td>To be Announced</td>
                   <td><span class="${colorPrice}">${priceChangePct}%</span> <span class="${textColor}">${priceChange}$</span></td>
               </tr>
       
       `);
     })
}
var nameArray = [];
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('value', function (snapshot) {
            var cryptos = snapshot.val();
            for (var key in cryptos) {
                var crypto = cryptos[key];
                nameArray.push(crypto.name);
            }
            createButtons();
        });
    } else {
        createButtons();
    }
})



function checkIfinPortfolio(name){
    return nameArray.includes(name);
}

function cryptoInPortfolio(){
    return nameArray;
}


function coinToPortfolio(name) {
    $(this).text("In Portfolio");
    var coinName = $(this).attr("data-name");
    var nameArray = [];
    console.log(firebase.auth().currentUser.uid);
    database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).on('child_added', function (snapshot) {
        console.log(snapshot.val().name);
        nameArray.push(snapshot.val().name);

    });
    if (nameArray.indexOf(coinName)<0){
        database.ref(`users/${firebase.auth().currentUser.uid}/cryptos`).push({
            name: coinName
        })
    }
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        database.ref(`users/${user.uid}/cryptos`).on('child_added', function (snapshot) {
            console.log(snapshot.val().name);
            createSavedButtons(snapshot.val().name);

        });
    }
});

$(document).on("click", "#addPortfolio", coinToPortfolio);
