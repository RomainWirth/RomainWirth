const inputNb1 = document.querySelector("#nb1") as HTMLInputElement;
const inputNb2 = document.querySelector("#nb2") as HTMLInputElement;
const divResults = document.querySelector(".results") as HTMLDivElement;
const calculButton = document.querySelector("#calcul") as HTMLButtonElement;

calculButton.addEventListener("click", function() {
  const result = addNumbers(+inputNb1.value, +inputNb2.value);
  divResults.innerHTML=result.toString();    
})


function addNumbers(n1: number, n2: number): number {
  return n1 + n2;
}