let loginBtn = document.getElementById("login");

const URL = "/logout";

fetch(URL);

loginBtn.addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  const URL = "/login";

  const data = {
    username,
    password,
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data == 200) {
        window.location.replace("dashboard.html");
      } else if (data == 700) {
        document.getElementById("error").innerText =
          "Username or password is incorrect!";
      } else if (data == 404) {
        document.getElementById("error").innerText = "User does not exist!";
      }
    });

  //reset input values to empty
  let allInputs = document.querySelectorAll("input");

  for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].value = "";
  }
});
