const URL = "/dashboard";

fetch(URL)
  .then((response) => response.json())
  .then((data) => {
    if (data == 404) {
      window.location.replace("index.html");
    } else {
      document.getElementById("db-username").innerText = data.username;
      document.getElementById("db-email").innerText = data.email;
    }
  });
