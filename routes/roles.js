var express = require("express");
var router = express.Router();
var db = require("../models");
var RoleService = require("../services/roleService");
var roleService = new RoleService(db);
var jsend = require("jsend");
var auth = require("../middleware/authenticate");
router.use(jsend.middleware);


// Admin can get a list of possible roles
router.get("/", auth.token, auth.isAdmin, async function ( req, res, next) {
    const roles = await roleService.getRoles();
    
    if ( roles.length === 0) {
        return res.jsend.fail({StatusCode: 500, Results: "No roles in database"})
    }

    return res.jsend.success({StatusCode: 200, Results: roles})
})


module.exports = router;