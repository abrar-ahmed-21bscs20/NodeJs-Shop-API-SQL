const express = require("express");
const routes = express.Router();

const orderController = require("../controllers/order-controller.js");

// cart/add-product => POST
routes.post("/place-order", orderController.placeOrder);

// cart/get-all-cart-products => GET
routes.get("/all-orders", orderController.getAllOrders);

module.exports = routes;
