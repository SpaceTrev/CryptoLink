var coinButtonArray = ["bitcoin", "litecoin", "ethereum", "cardano", "stellar"];
function createButtons() {
$("#coinPrice").empty();
for (var i=0; i < coinButtonArray.length; i++) {
var buttonArr = $( "<button class='btn btn-info'>");
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
 .then(function(response) {
     var coinPrice = response[0].price_usd;
     $("#coinPrice").append("Price of " + coinName + " in USD: " + coinPrice);
     console.log(response);
    // console.log(response[0].price_usd);
    // $("#coinPrice").html("Bitcoin Price In USD: " + response[0].price_usd)
  });
}
  $("#addCoin").on("click", function(event) {
      event.preventDefault();
      var coinName = $("#coinInput").val().trim();
      coinButtonArray.push(coinName);
      createButtons();
  });
  $(document).on("click", ".coinButtons", displayCoin);
  createButtons();