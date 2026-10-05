console.log("LOGIN JS WORKS");

var loginForm = document.getElementById("loginForm");

console.log(loginForm);
var loginForm = document.getElementById("loginForm");

var errorElement = document.getElementById("error");

loginForm.addEventListener("submit", function (event) {
  console.log("КНОПКА НАЖАТА");
  event.preventDefault();

  var username = document.getElementById("username").value;

  var password = document.getElementById("password").value;
  console.log("ОТПРАВЛЯЕМ LOGIN");
  fetch("http://127.0.0.1:8000/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      return response.json();
    })
    .then(function (data) {
      console.log("Успешный вход:", data);

      localStorage.setItem("access_token", data.access_token);

      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      } else if (data.user.role === "courier") {
        window.location.href = "courier.html";
      } else {
        errorElement.textContent = "Неизвестная роль пользователя";
      }
    })
    .catch(function (error) {
      console.error("Ошибка:", error);

      errorElement.textContent = error.message;
    });
});
