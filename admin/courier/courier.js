var token = localStorage.getItem("access_token");

if (!token) {
  window.location.href = "login.html";
}

fetch("http://127.0.0.1:8000/me", {
  headers: {
    Authorization: "Bearer " + token,
  },
})
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Не авторизован");
    }

    return response.json();
  })
  .then(function (data) {
    if (data.user.role !== "courier") {
      window.location.href = "login.html";
    }
  })
  .catch(function () {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
  });

var ordersContainer = document.getElementById("orders");
var refreshButton = document.getElementById("refreshButton");
var logoutButton = document.getElementById("logoutButton");

/* ЗАГРУЗКА ЗАКАЗОВ */

function loadOrders() {
  fetch("http://127.0.0.1:8000/courier/orders", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось загрузить заказы");
      }

      return response.json();
    })

    .then(function (orders) {
      ordersContainer.innerHTML = "";

      if (orders.length === 0) {
        ordersContainer.innerHTML =
          '<div class="empty">' + "У вас пока нет заказов" + "</div>";

        return;
      }

      orders.forEach(function (order) {
        var orderElement = document.createElement("div");

        orderElement.className = "order-card";

        /* КНОПКА СЛЕДУЮЩЕГО СТАТУСА */

        var button = "";

        if (order.status === "new") {
          button =
            '<button onclick="updateStatus(' +
            order.id +
            ", 'accepted')" +
            '">' +
            "Принять заказ" +
            "</button>";
        } else if (order.status === "accepted") {
          button =
            '<button onclick="updateStatus(' +
            order.id +
            ", 'preparing')" +
            '">' +
            "Начать готовить" +
            "</button>";
        } else if (order.status === "preparing") {
          button =
            '<button onclick="updateStatus(' +
            order.id +
            ", 'delivering')" +
            '">' +
            "Взял заказ" +
            "</button>";
        } else if (order.status === "delivering") {
          button =
            '<button onclick="updateStatus(' +
            order.id +
            ", 'delivered')" +
            '">' +
            "Доставлено" +
            "</button>";
        } else if (order.status === "delivered") {
          button = '<div class="order-complete">' + "Заказ завершён" + "</div>";
        }

        orderElement.innerHTML =
          '<div class="order-top">' +
          '<span class="order-number">' +
          "Заказ #" +
          order.id +
          "</span>" +
          '<span class="status">' +
          order.status +
          "</span>" +
          "</div>" +
          '<div class="customer">' +
          '<div class="customer-name">' +
          order.customer_name +
          "</div>" +
          '<div class="customer-info">' +
          "📞 " +
          order.phone +
          "<br>" +
          "📍 " +
          order.address +
          "</div>" +
          "</div>" +
          '<div class="total">' +
          "<span>ИТОГО</span>" +
          "<span>" +
          order.total_price +
          " сом" +
          "</span>" +
          "</div>" +
          '<div class="order-buttons">' +
          button +
          "</div>";

        ordersContainer.appendChild(orderElement);
      });
    })

    .catch(function (error) {
      console.error("Ошибка:", error);

      ordersContainer.innerHTML =
        '<div class="empty">' + "Ошибка загрузки заказов" + "</div>";
    });
}

/* ИЗМЕНЕНИЕ СТАТУСА */

function updateStatus(orderId, newStatus) {
  fetch("http://127.0.0.1:8000/courier/orders/" + orderId + "/status", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + token,
    },

    body: JSON.stringify({
      status: newStatus,
    }),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось изменить статус");
      }

      return response.json();
    })

    .then(function (data) {
      console.log("Статус изменён:", data);

      loadOrders();
    })

    .catch(function (error) {
      console.error("Ошибка:", error);
    });
}

/* ОБНОВИТЬ */

refreshButton.addEventListener("click", loadOrders);

/* ВЫХОД */

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("access_token");

  window.location.href = "login.html";
});

/* ЗАПУСК */

loadOrders();
