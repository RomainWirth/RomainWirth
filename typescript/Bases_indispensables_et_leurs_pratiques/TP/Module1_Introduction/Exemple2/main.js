var inputNb1 = document.querySelector("#nb1");
var inputNb2 = document.querySelector("#nb2");
var divResults = document.querySelector(".results");
var calculButton = document.querySelector("#calcul");
calculButton.addEventListener("click", function () {
    var result = addNumbers(+inputNb1.value, +inputNb2.value);
    divResults.innerHTML = result.toString();
});
function addNumbers(n1, n2) {
    return n1 + n2;
}
