const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  const URL = "/logout";

  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data == 200) {
        window.location.replace("index.html");
      }
    });
});
