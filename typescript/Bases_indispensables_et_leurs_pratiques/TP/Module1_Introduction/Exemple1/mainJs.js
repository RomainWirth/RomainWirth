const nb1 = document.querySelector("#nb1");
const nb2 = document.querySelector("#nb2");

document.querySelector("#calcul").addEventListener("click", function() {
  let result = add(nb1.value, nb2.value);
  document.querySelector(".results").innerHTML=result;
})

function add(n1, n2) {
  if (typeof(n1) !== "number" && typeof(n2) !== "number") {
    // Conversion implicite en type number
    // équivalent à : parseInt(n1) + parseInt(n2)
    return +n1 + +n2;
  }
  return n1 + n2;
}