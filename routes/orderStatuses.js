var express = require("express");
var router = express.Router();
var db = require("../models");
var OrderStatusService = require("../services/orderStatusService");
var orderStatusService = new OrderStatusService(db);
var auth = require("../middleware/authenticate");
var jsend = require("jsend");
router.use(jsend.middleware);

router.get("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["OrderStatus"]
    #swagger.description = "Get all OrderStatuses"
*/
    const orderStatusNames = await orderStatusService.getOrderStatus();

    return res.jsend.success({StatusCode: 200, Results: orderStatusNames})
})

router.put("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["OrderStatus"]
    #swagger.description = "Update the status of an order belonging to specific orderNumber"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateOrderStatus"
        }
	}
*/

    const { id, newStatusName } = req.body;
    const lettersOnlyRegex = /^[a-åA-Å]{2,}$/;

    if ( !lettersOnlyRegex.test(newStatusName)) {
        return res.jsend.fail({StatusCode: 401, Results: "Invalid status name. Only letters allowed"})
    }

    try {
        await orderStatusService.updateStatusNames(id, newStatusName);
        return res.jsend.success({StatusCode: 200, Results: "Status name updated"})
    } catch (error) {
        console.log(error)
        return res.jsend.fail({StatusCode: 500, Results: error.errors})
    }
})



module.exports = router;