
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var auth = require("../middleware/authenticate");
var db = require("../models");
var UserService = require("../services/userService");
var userService = new UserService(db);
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var MembershipService = require("../services/membershipService");
var membershipService = new MembershipService(db);
var BrandService = require("../services/brandService");
var brandService = new BrandService(db)
var CategoryService = require("../services/categoryService");
var categoryService = new CategoryService(db);
var OrderService = require("../services/orderService");
var orderService = new OrderService(db);
var OrderStatusService = require("../services/orderStatusService");
var orderStatusService = new OrderStatusService(db);
var RoleService = require("../services/roleService");
var roleService = new RoleService(db);
var jsend = require("jsend");
router.use(jsend.middleware);

router.get("/", async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get login page for admin UI"
*/


    return res.render("adminLogin", {user: req.user})
})


router.get("/dashboard", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get dashboard page for admin after successful login"
*/

    res.render("adminDashboard", {user: req.user})
})

router.get("/products", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get admin products page with crud functionality"
*/

    const products = await productService.queryProducts();
    const categories = await categoryService.getAllCategories();
    const brands = await brandService.getBrands();
    


    res.render("adminProducts", { user: req.user, products: products, categories: categories, brands: brands})
})

// Working on making the search fuction for the admin/products CHECK PARAMS
router.get("/products/:data", auth.token, auth.isAdmin, async function ( req, res, next) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Searching for product name, brand or category using the search bar in the products page"
*/

    const userSearch = req.params.data;
    const categories = await categoryService.getAllCategories();
    const brands = await brandService.getBrands();
    
    searchedProducts = await productService.searchProducts(userSearch)
    
    res.render("adminProducts", { user: req.user, products: searchedProducts, categories: categories, brands: brands})
   
})

router.get("/brands", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get a list of all brands with crud functionality"
*/

    const brands = await brandService.getBrands();
    res.render("adminBrands", {user: req.user, brands: brands})
})

router.get("/categories", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get categories page for admin with crud functionality"
*/

    const categories = await categoryService.getAllCategories();

    res.render("adminCategories", { user: req.user, categories: categories})
})

router.get("/memberships", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get membership page for admin with crud functionality"
*/

    const memberships = await membershipService.getMemberships()

    res.render("adminMemberships", {user: req.user, memberships: memberships})
})

router.get("/orders", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get orders page for admin, where only order status can be changed"
*/

    let orders = await orderService.getAllOrders()
    let uniqueOrders = [];

    orders.forEach(order => {// Check if the order with the same OrderNumber already exists in uniqueOrders
        if (!uniqueOrders.find(uniqueOrder => uniqueOrder.OrderNumber === order.OrderNumber)) {
            uniqueOrders.push(order);
        }
       
    });

    try {
        res.render("adminOrders", {user: req.user, orders: uniqueOrders})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: error})
    }
})

router.get("/users", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get a list of all users (Only user id, username and role is vissible), with possibility to change user Role to Admin or User"
*/

    const data = await userService.getUsers();
  
    let users = data.map(user => ({ // Only grabing essential data
        id: user.id,
        username: user.UserName,
        role: user.Role.Role
    }));
    res.render("adminUsers", { user: req.user, users: users})
})

router.get("/orderStatuses", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Get all user orders (Only orderNumber vissible). Only orderStatus can be updated"
*/

    const orderStatuses = await orderStatusService.getOrderStatus();

    try {
        res.render("adminOrderStatuses", {user: req.user, orderStatuses: orderStatuses})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: error})
    }

})


router.post("/login", async function ( req ,res, next ) {
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Login functionality for admin users. Logging in to localhost with an admin will make all these methods work, because the admin ui uses res.cookie instead of authorization header"
    #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/Login"
        }
    }
*/

    const { emailOrUsername, password } = req.body;
    let user;
    if ( emailOrUsername.includes("@") ) { // checking if logging in with email or username
        const email = emailOrUsername;
        user = await userService.getUserEmail(email);
        if ( !user ) { // If no user is found, email was wrong
            return res.jsend.fail({StatusCode: 401, Results: "Invalid email"})
        }

    } else {
        const username = emailOrUsername;
        user = await userService.getUsername(username);
        if ( !user ){ // if no user was found, username was wrong
            return res.jsend.fail({StatusCode: 401, Results: "Invalid username"})
        }
    }
    
    crypto.pbkdf2( password, user.Salt, 310000, 32, "sha256", async function (err, hashedPassword) {
        if ( err ) {
            return res.jsend.fail({ StatusCode: 500, Results: `Error on login: ${err}` })
        }
        
        if (!crypto.timingSafeEqual(user.EncryptedPassword, hashedPassword)) {
            return res.jsend.fail({StatusCode: 401, Results: "Password incorrect"})
        } else if ( user.Role.Role !== "Admin") { // Add this in later --------------------------------
            return res.redirect("/admin");
            //return res.jsend.fail({StatusCode: 500, Results: "Only admin access"})
        } 

        let token = jwt.sign( 
            {   id: user.id, 
                Username: user.UserName, 
                Email: user.Email, 
                Role: user.Role.Role, 
                MembershipId: user.MembershipId,
                Discount: user.Membership.Discount,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "2h"}
        )

        res.cookie("token", token, { httpOnly: true }) // httpOnly = true to make the token accessed only through http requests
        res.redirect("/admin/dashboard")
    })
})

router.post("/logout", async function ( req, res, next ) { 
/*  #swagger.tags = ["Admin"]
    #swagger.description = "Logout does not remove the cookie stored in the browser, but you can then login with another user"
*/
    req.user = undefined;
    res.render("adminLogin", {user: req.user})
})


module.exports = router;