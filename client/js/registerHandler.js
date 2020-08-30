let registerBtn = document.getElementById("submit");

const URL = "/logout";

fetch(URL);

registerBtn.addEventListener("click", () => {
  let email = document.getElementById("email-reg").value;
  let username = document.getElementById("username-reg").value;
  let password = document.getElementById("password-reg").value;
  let passwordRepeat = document.getElementById("password-reg-rep").value;

  //reset input values to empty
  let allInputs = document.querySelectorAll("input");

  function resetInputs() {
    for (let i = 0; i < allInputs.length; i++) {
      allInputs[i].value = "";
    }
  }

  if (!email || !username || !password || !passwordRepeat) {
    console.log("EMPTY");
    resetInputs();
    return;
  }

  const data = {
    email,
    username,
    password,
  };

  const URL = "http://localhost:3000/register";

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  resetInputs();
});
