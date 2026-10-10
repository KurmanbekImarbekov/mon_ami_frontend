(function () {
  "use strict";

  var ORDERS_KEY = "monamiOrders";
  var DRAFT_KEY = "monamiCheckoutDraft";

  var WORKER_URL = "https://monami-telegram.cmolohov46.workers.dev";

  function readJson(key, fallback) {
    try {
      var parsed = JSON.parse(localStorage.getItem(key));
      return parsed || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function createOrderNumber() {
    var date = new Date();

    var datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");

    var randomPart = Math.floor(1000 + Math.random() * 9000);

    return "MA-" + datePart + "-" + randomPart;
  }

  // Отправка заказа в Telegram через Worker
  async function sendOrderToTelegram(order) {
    try {
      var response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          action: "new_order",

          name: order.customer?.name || "Не указано",
          phone: order.customer?.phone || "Не указан",

          address:
            order.deliveryAddress?.address +
              (order.deliveryAddress?.apartment
                ? ", кв " + order.deliveryAddress.apartment
                : "") +
              (order.deliveryAddress?.floor
                ? ", этаж " + order.deliveryAddress.floor
                : "") || "Не указан",

          comment: order.deliveryAddress?.comment || "",
          total: order.totals?.total || 0,
          orderNumber: order.orderNumber,
          items: order.items || [],
        }),
      });

      console.log("Telegram status:", response.status);
    } catch (error) {
      console.error("Ошибка отправки в Telegram:", error);
    }
  }

  // Отправка оплаченного заказа в FastAPI
  async function sendOrderToBackend(order) {
    try {
      var response = await fetch(
        "https://bubble-cigarettes-inter-chosen.trycloudflare.com/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_name: order.customer?.name || "Не указано",

            phone: order.customer?.phone || "Не указан",

            address: order.deliveryAddress?.address || "Самовывоз",

            total_price: order.totals?.total || 0,

            items: (order.items || []).map(function (item) {
              return {
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
              };
            }),
          }),
        },
      );

      var data = await response.json();

      console.log("FastAPI:", data);

      return data;
    } catch (error) {
      console.error("Ошибка отправки в FastAPI:", error);

      return null;
    }
  }

  // Создаёт заказ и сохраняет локально
  // Telegram и FastAPI здесь НЕ вызываются
  function createOrder(payload) {
    console.log("ORDER PAYLOAD:", payload);

    var orders = readJson(ORDERS_KEY, []);

    var now = new Date().toISOString();

    var order = Object.assign({}, payload, {
      id:
        window.crypto && window.crypto.randomUUID
          ? window.crypto.randomUUID()
          : "order-" + Date.now(),

      orderNumber: createOrderNumber(),

      status: "pending_payment",

      createdAt: now,

      updatedAt: now,
    });

    orders.unshift(order);

    writeJson(ORDERS_KEY, orders);

    return order;
  }

  // Вызывается после подтверждения оплаты
  async function confirmPayment(orderId) {
    var orders = readJson(ORDERS_KEY, []);

    var order = orders.find(function (o) {
      return o.id === orderId || o.orderNumber === orderId;
    });

    if (!order) {
      console.error("confirmPayment: заказ не найден", orderId);

      return null;
    }

    // Меняем статус заказа
    order.status = "paid";

    order.updatedAt = new Date().toISOString();

    writeJson(ORDERS_KEY, orders);

    // Сначала отправляем оплаченный заказ в FastAPI
    await sendOrderToBackend(order);

    // Потом отправляем заказ в Telegram
    await sendOrderToTelegram(order);

    return order;
  }

  function listOrders() {
    return readJson(ORDERS_KEY, []);
  }

  function getOrder(orderId) {
    return (
      listOrders().find(function (order) {
        return order.id === orderId || order.orderNumber === orderId;
      }) || null
    );
  }

  function saveDraft(draft) {
    writeJson(DRAFT_KEY, draft);
  }

  function getDraft() {
    return readJson(DRAFT_KEY, {});
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  window.OrderService = {
    createOrder: createOrder,

    confirmPayment: confirmPayment,

    listOrders: listOrders,

    getOrder: getOrder,

    saveDraft: saveDraft,

    getDraft: getDraft,

    clearDraft: clearDraft,
  };
})();
