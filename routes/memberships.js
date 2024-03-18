var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var db = require("../models");
var MembershipService = require("../services/membershipService");
var membershipService = new MembershipService(db);
var UserService = require("../services/userService");
var userService = new UserService(db);
var auth = require("../middleware/authenticate");
router.use(jsend.middleware);

router.get("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Membership"]
    #swagger.description = "Get all membership levels"
*/

    const membershipLevels = await membershipService.getMemberships();

    return res.jsend.success({StatusCode: 200, Results: membershipLevels})
    
})


router.post("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Membership"]
    #swagger.description = "Create new membership"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/CreateMembership"
        }
	}
*/

    let {status, discount} = req.body;
    const onlyLettersRegex = /^[a-åA-Å]{2,}$/;

    if ( isNaN(parseInt(discount))) { // checking if discount is a number
        return res.jsend.fail({StatusCode: 401, Results: "Discount has to be a number"})
    }

    discount = discount/100; // turning discount into format for calculations

    if ( !onlyLettersRegex.test(status)) { // Checkign status format
        return res.jsend.fail({StatusCode: 401, Results: "Status can be only letters"})
    }

    try {
        await membershipService.createMembership(status, discount);
        return res.jsend.success({StatusCode: 200, Results: "Membership level created"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Name must be unique"})
    }
})


router.put("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Membership"]
    #swagger.description = "Update one of the current membership levels"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateMembership"
        }
	}
*/

    let {id, newStatus, newDiscount} = req.body;
    const onlyLettersRegex = /^[a-åA-Å]{2,}$/;
    const memberships = await membershipService.getMemberships()

    if ( !typeof newDiscount === "number") { // checking if newDiscount is a number
        return res.jsend.fail({StatusCode: 401, Results: "Discount has to be a number"})
    }

    newDiscount = newDiscount/100; // turning discount into correct value for calculations

    if ( !onlyLettersRegex.test(newStatus)) { // Checking if newStatus is in the right format
        return res.jsend.fail({StatusCode: 401, Results: "Status can be only letters"})
    }

    try {
        await membershipService.updateMembership(id, newStatus, newDiscount)
        return res.jsend.success({StatusCode: 200, Results: "Membership level updated"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Name must be unique"})
    }
})


router.delete("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Membership"]
    #swagger.description = "Deleting a membership level, only if it do not belong to a user"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/DeleteMembership"
        }
	}
*/

    const id = req.body.id;
    const users = await userService.getUsers();
    for ( let user of users) {
        if ( id === user.MembershipId) {
            return res.jsend.fail({StatusCode: 500, Results: "Invalid delete! Membership level belongs to user"})
        }
    }

    try {
        await membershipService.deleteMembership(id);
        return res.jsend.success({StatusCode: 200, Results: "Membership level deleted"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: error})
        
    }
})

module.exports = router;