var express = require("express");
var router = express.Router();
var db = require("../models");
var OrderService = require("../services/orderService");
var orderService = new OrderService(db);
var auth = require("../middleware/authenticate");
var jsend = require("jsend");
router.use(jsend.middleware);


router.get("/", auth.token, auth.isUser, async function ( req, res, next ) {
/*  #swagger.tags = ["Orders"]
    #swagger.description = "Get all orders for logged in user. Admin users get a list of every users orders"
*/
    const user = req.user;

    if ( user.Role === "Admin") { // Admin can see all orders from all users
        const orders = await orderService.getAllOrders();

        const orderTotals = {};

        orders.forEach(order => {
            const { OrderNumber, DiscountedPrice, Quantity } = order;
            
            // Check if the order number already exists in the orderTotals object
            if (orderTotals[OrderNumber]) {
                // If it exists, add the discounted price to the existing total
                orderTotals[OrderNumber] += DiscountedPrice * Quantity;
            } else {
                // If it doesn't exist, create a new entry with the discounted price
                orderTotals[OrderNumber] = DiscountedPrice * Quantity;
            }
        });

        const orderNumbers = Object.keys(orderTotals);
        for (let number of orderNumbers) {
            for (let order of orders) {
                if (order.OrderNumber === number) {
                    order.dataValues.orderTotalWithDiscount = orderTotals[number]; // Adding total cost with discount on each order
                }
            }
        }

        return res.jsend.success({StatusCode: 200, Results: orders})
    } else { // Users can only see their own orders
        const orders = await orderService.getUserOrders(user.id);
        

        const orderTotals = {};

        orders.forEach(order => {
            const { OrderNumber, DiscountedPrice, Quantity } = order;
            
            // Check if the order number already exists in the orderTotals object
            if (orderTotals[OrderNumber]) {
                // If it exists, add the discounted price to the existing total
                orderTotals[OrderNumber] += DiscountedPrice * Quantity;
            } else {
                // If it doesn't exist, create a new entry with the discounted price
                orderTotals[OrderNumber] = DiscountedPrice * Quantity;
            }
        });

        const orderNumbers = Object.keys(orderTotals);
        for (let number of orderNumbers) {
            for (let order of orders) {
                if (order.OrderNumber === number) {
                    order.dataValues.orderTotalWithDiscount = orderTotals[number]; // Adding total cost with discount on each order
                }
            }
        }

        return res.jsend.success({StatusCode: 200, Results: orders})
    }
})


router.put("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Orders"]
    #swagger.description = "Update orderStatus of the order connected to the orderNumber"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateOrderStatus"
        }
	}
*/
    
    const {orderNumber, newStatusId} = req.body;
    try {
        await orderService.updateOrderStatus(orderNumber, newStatusId)
        return res.jsend.success({StatusCode: 200, Results: "Update successful"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Error during status change", Error: error})
        
    }
})



module.exports = router;