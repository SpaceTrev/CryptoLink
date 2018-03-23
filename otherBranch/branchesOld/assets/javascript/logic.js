
var coinButtonArray = ["bitcoin", "litecoin", "ethereum", "cardano", "stellar", "neo"];
function createButtons() {
    $("#coinPrice").empty();
    for (var i = 0; i < coinButtonArray.length; i++) {
        var buttonArr = $("<button class='btn btn-info'>");
        buttonArr.addClass("coinButtons");
        buttonArr.attr("data-name", coinButtonArray[i]);
        buttonArr.text(coinButtonArray[i]);
        $("#coinButtonView").append(buttonArr);
    }
}
function displayCoin() {
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
            $("#coinPrice").append("Rank # " + coinRank + " Price of " + coinName + " in USD: " + coinPrice + " Market Cap: " + marketCap + "<br>");
            console.log(response);
        });
}
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
