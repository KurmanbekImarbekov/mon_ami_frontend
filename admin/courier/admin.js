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
    if (data.user.role !== "admin") {
      window.location.href = "login.html";
    }
  })
  .catch(function () {
    localStorage.removeItem("access_token");
    window.location.href = "login.html";
  });

var ordersContainer = document.getElementById("orders");
var totalOrdersElement = document.getElementById("totalOrders");
var newOrdersElement = document.getElementById("newOrders");
var activeOrdersElement = document.getElementById("activeOrders");
var deliveredOrdersElement = document.getElementById("deliveredOrders");
var logoutButton = document.getElementById("logoutButton");

var couriers = [];

// Загрузка курьеров
function loadCouriers() {
  var token = localStorage.getItem("access_token");

  return fetch("http://127.0.0.1:8000/couriers", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось загрузить курьеров");
      }

      return response.json();
    })
    .then(function (data) {
      couriers = data;

      console.log("Курьеры:", couriers);
    })
    .catch(function (error) {
      console.error("Ошибка загрузки курьеров:", error);
    });
}

// Загрузка заказов
function loadOrders() {
  var token = localStorage.getItem("access_token");

  return fetch("http://127.0.0.1:8000/orders", {
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

      updateStatistics(orders);

      if (orders.length === 0) {
        ordersContainer.innerHTML =
          '<div class="empty">' + "Заказов пока нет" + "</div>";

        return;
      }

      orders.forEach(function (order) {
        var orderElement = document.createElement("div");

        orderElement.className = "order-card";

        // Ищем уже назначенного курьера
        var assignedCourier = couriers.find(function (courier) {
          return courier.id === order.courier_id;
        });

        // Создаём список курьеров
        var courierOptions = '<option value="">Выберите курьера</option>';

        couriers.forEach(function (courier) {
          var selected = "";

          if (courier.id === order.courier_id) {
            selected = " selected";
          }

          courierOptions +=
            '<option value="' +
            courier.id +
            '"' +
            selected +
            ">" +
            courier.username +
            "</option>";
        });

        var courierInfo = "";

        if (assignedCourier) {
          courierInfo =
            '<div class="assigned-courier">' +
            "Назначен: " +
            assignedCourier.username +
            "</div>";
        } else {
          courierInfo =
            '<div class="assigned-courier">' + "Курьер не назначен" + "</div>";
        }

        var courierButtonText = "Назначить курьера";

        if (assignedCourier) {
          courierButtonText = "Переназначить курьера";
        }

        orderElement.innerHTML =
          '<div class="order-top">' +
          '<span class="order-number">' +
          "Заказ #" +
          order.id +
          "</span>" +
          '<span class="status" id="status-' +
          order.id +
          '">' +
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
          '<div class="courier-section">' +
          "<label>Курьер</label>" +
          '<select id="courier-' +
          order.id +
          '">' +
          courierOptions +
          "</select>" +
          courierInfo +
          '<button onclick="assignCourier(' +
          order.id +
          ')">' +
          courierButtonText +
          "</button>" +
          "</div>" +
          '<div class="order-buttons">' +
          '<button onclick="updateStatus(' +
          order.id +
          ", 'accepted')\">" +
          "Принять" +
          "</button>" +
          '<button onclick="updateStatus(' +
          order.id +
          ", 'preparing')\">" +
          "Готовится" +
          "</button>" +
          '<button onclick="updateStatus(' +
          order.id +
          ", 'delivering')\">" +
          "Доставляется" +
          "</button>" +
          '<button onclick="updateStatus(' +
          order.id +
          ", 'delivered')\">" +
          "Доставлено" +
          "</button>" +
          "</div>";

        ordersContainer.appendChild(orderElement);
      });
    })
    .catch(function (error) {
      console.error("Ошибка загрузки заказов:", error);
    });
}

// Статистика
function updateStatistics(orders) {
  var total = orders.length;

  var newOrders = orders.filter(function (order) {
    return order.status === "new";
  }).length;

  var activeOrders = orders.filter(function (order) {
    return (
      order.status === "accepted" ||
      order.status === "preparing" ||
      order.status === "delivering"
    );
  }).length;

  var deliveredOrders = orders.filter(function (order) {
    return order.status === "delivered";
  }).length;

  totalOrdersElement.textContent = total;
  newOrdersElement.textContent = newOrders;
  activeOrdersElement.textContent = activeOrders;
  deliveredOrdersElement.textContent = deliveredOrders;
}

// Изменение статуса заказа
function updateStatus(orderId, newStatus) {
  var token = localStorage.getItem("access_token");

  fetch("http://127.0.0.1:8000/orders/" + orderId, {
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
      console.error("Ошибка изменения статуса:", error);
    });
}

// Назначение курьера
function assignCourier(orderId) {
  var select = document.getElementById("courier-" + orderId);

  var courierId = select.value;

  if (!courierId) {
    alert("Сначала выберите курьера");
    return;
  }

  var token = localStorage.getItem("access_token");

  fetch(
    "http://127.0.0.1:8000/orders/" +
      orderId +
      "/assign?courier_id=" +
      courierId,
    {
      method: "PATCH",

      headers: {
        Authorization: "Bearer " + token,
      },
    },
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось назначить курьера");
      }

      return response.json();
    })
    .then(function (data) {
      console.log("Курьер назначен:", data);

      alert("Курьер успешно назначен!");

      // Снова загружаем заказы,
      // чтобы сразу показать назначенного курьера
      loadOrders();
    })
    .catch(function (error) {
      console.error("Ошибка назначения курьера:", error);

      alert("Ошибка назначения курьера");
    });
}

// Сначала курьеры,
// потом заказы
loadCouriers().then(function () {
  loadOrders();
});

// Выход
logoutButton.addEventListener("click", function () {
  localStorage.removeItem("access_token");

  window.location.href = "login.html";
});
