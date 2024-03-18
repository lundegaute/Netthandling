var express = require("express");
var router = express.Router();
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
var OrderStatusService = require("../services/orderStatusService");
var orderStatusService = new OrderStatusService(db);
var RoleService = require("../services/roleService");
var roleService = new RoleService(db);
var encryptPasswordAndSalt = require("../middleware/createEncryptedPassword");
var axios = require("axios");
var jsend = require("jsend");
router.use(jsend.middleware);


// Initialize database
router.post("/", async function (req, res, next ) {
/*  #swagger.tags = ["Init"]
    #swagger.description = "Initializing the entire database with Product, Brands, Categories, Membership levels, Order statuses, Roles and creating an admin user"
*/

    const productApi = "http://backend.restapi.co.za/items/products"
    const brandSet = new Set();
    const categorySet = new Set();
    let data;
    const brands = await brandService.getBrands();
    const categories = await categoryService.getAllCategories();
    const memberships = await membershipService.getMemberships();
    const orderStatuses = await orderStatusService.getOrderStatus();
    const roles = await roleService.getRoles();
    const products = await productService.queryProducts();


    try { // Get api data
        const response = await axios.get(productApi)
        data = response.data.data
    } catch (error) {
        return res.jsend.error({StatusCode: 500, message: "Error fetching api data", error: error})
    }   

    for ( let product of data ) { 
        brandSet.add(product.brand)
        categorySet.add(product.category)
    }
    
    
        try {
            if ( brands.length === 0 ) {
                for ( let brand of brandSet) { // Creating brands
                    await brandService.createBrand(brand);
                }
            }
            if ( categories.length === 0 ) {
                for ( let category of categorySet) { // Creating categories
                    await categoryService.createCategory(category);
                }
            }
            if ( memberships.length === 0 ) { // Creating membership status
                await membershipService.createMembership("Bronze", 0)
                await membershipService.createMembership("Silver", 0.15)
                await membershipService.createMembership("Gold", 0.3)
            }
            if ( orderStatuses.length === 0 ) { // Creating orderStatuses
                await orderStatusService.createStatus("In Progress")
                await orderStatusService.createStatus("Ordered")
                await orderStatusService.createStatus("Completed")
            }
            if ( roles.length === 0 ) { // Creating Roles
                await roleService.createRole("Admin")
                await roleService.createRole("User")
            }
        } catch (error) {
            return res.jsend.fail({StatusCode: 500, Results: "Error during database initialization", error: error.errors})
        }


    await Promise.all(data.map( async ( product ) => { // correcting data object to fit my productService structure
        const brand = await brandService.getBrandByName(product.brand)
        const category = await categoryService.getCategoryByName(product.category)
        product.BrandId = brand.id
        product.CategoryId = category.id

        product.Name = product.name
        product.Description = product.description
        product.UnitPrice = product.price;
        product.Quantity = product.quantity
       
    }))


    if ( products.length === 0 ) {
        try {
            for ( let product of data ) { // Creating products
                await productService.createProduct(product);
            }
        } catch (error) {
            return res.jsend.error({StatusCode: 500, message: error.errors})
        }
    }

    const adminUser = { 
        firstName: "Admin",
        lastName: "Support",
        userName: "Admin",
        password: "P@ssword2023",
        email: "admin@noroff.no",
        address: "Online",
        telephoneNumber: "911",
    }

    try {  // Creating encrypted password and salt, and adding it to the adminUser object and creating the admin user
        const encryptedData = await encryptPasswordAndSalt(adminUser.password)
        adminUser.encryptedPassword = encryptedData.encryptedPassword;
        adminUser.salt = encryptedData.salt;
        await userService.createAdmin(adminUser)
    } catch (error) {
        return res.jsend.error({StatusCode: 500, message: error.errors[0].message})
    }

    return res.jsend.success({StatusCode: 200, Results: "Database successfuly initiated", Data: data})
})


module.exports = router;