var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var db = require("../models");
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var UserService = require("../services/userService");
var userService = new UserService(db);
var auth = require("../middleware/authenticate");
router.use(jsend.middleware);


// Get all products not deleted in the database
router.get("/", async function (req, res, next) {
/*  #swagger.tags = ["Products"]
    #swagger.description = "Get all products that are not deleted in the database"
*/   
    //filter out products where isDeleted = 1
    let products = await productService.queryProducts();
    products = products.filter( (product) => {
        return !product.IsDeleted
    })

    try {
        return res.jsend.success({ StatusCode: 200, Results: products });
    } catch (error) {
        return res.jsend.error({ StatusCode: 500, message: error });
    }

});

// Adding new product to database
router.post("/", auth.token, auth.isAdmin, async function (req, res, next) {
/*  #swagger.tags = ["Products"]
    #swagger.description = "Create a new product"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/CreateProduct"
        }
	}
*/

    const product = req.body;
    let emptyFieldList = [];

    // Example - key: unitPrice, value: 649 - If value is empty, we add key to the emptyFields list
    for ( let [key, value] of Object.entries(product)) {
        if ( !value || value === "" ) {
            let words = key.split(/(?=[A-Z])/); // split on capital letters (brandId = [brand, Id])
            let emptyField = words.map( (word) => { return word[0].toUpperCase()+word.slice(1)}).join(" ") // capitalize first letter in each word and joins into a string
            emptyFieldList.push(` ${emptyField} can not be empty`)
        }
    }

    if ( emptyFieldList.length > 0) {
        return res.jsend.fail({StatusCode: 401, Results: emptyFieldList})
    }
    
    if ( !isNaN(product.Name)) {
        return res.jsend.fail({StatusCode: 401, Results: "Name can not be a number"})
    }
    if ( !isNaN(product.Description)) {
        return res.jsend.fail({StatusCode: 401, Results: "Description can not be a number"})
    }
    if ( !isNaN(product.imgurl)) {
        return res.jsend.fail({StatusCode: 401, Results: "imgurl can not be a number"})
    }
    if ( !isNaN(product.Description)) {
        return res.jsend.fail({StatusCode: 401, Results: "Description can not be a number"})
    }
    if ( isNaN(product.UnitPrice)) {
        return res.jsend.fail({StatusCode: 401, Results: "Price must be a number"})
    } else if ( product.UnitPrice < 0) {
        return res.jsend.fail({StatusCode: 401, Results: "Price must be larger than zero"})
    }
    if ( isNaN(product.Quantity)) {
        return res.jsend.fail({StatusCode: 401, Results: "Quantity must be a number"})
    } else if ( product.Quantity < 0 ) {
        return res.jsend.fail({StatusCode: 401, Results: "Quantity must be larger than zero"})
    }

    try {
        await productService.createProduct( product );
        return res.jsend.success({ StatusCode: 200, Results: "Product added successfully"});
    } catch (error) {
        return res.jsend.fail({ StatusCode: 500, Results: error.errors[0].message, error: error.errors[0].message,});
    }

});

// Updating product data
router.put("/", auth.token, auth.isAdmin, async function (req, res, next) {
/*  #swagger.tags = ["Products"]
    #swagger.description = "Update a product"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateProduct"
        }
	}
*/

    const product = req.body;
    console.log(product)

    if ( isNaN(product.IsDeleted)) {
        return res.jsend.fail({ StatusCode: 401, Results: "IsDeleted must be a number" });
    } else if ( product.IsDeleted < 0 || product.IsDeleted > 1) {
        return res.jsend.fail({ StatusCode: 401, Results: "IsDeleted value can only be 0 or 1" });
    }

    try {
        const checkProduct = await productService.getProduct(product.id);
        if (!checkProduct) {
            return res.jsend.fail({ StatusCode: 500, Results: "Product not found" });
        }
    } catch (error) {
        console.log(error)
        return res.jsend.fail({StatusCode: 500, Results: error})
    }

    if ( !isNaN(product.Name)) {
        return res.jsend.fail({StatusCode: 401, Results: "Name can not be a number"})
    }
    if ( !isNaN(product.Description)) {
        return res.jsend.fail({StatusCode: 401, Results: "Description can not be a number"})
    }
    if ( !isNaN(product.imgurl)) {
        return res.jsend.fail({StatusCode: 401, Results: "imgurl can not be a number"})
    }
    if ( !isNaN(product.Description)) {
        return res.jsend.fail({StatusCode: 401, Results: "Description can not be a number"})
    }

    if ( isNaN(product.UnitPrice)) {
        return res.jsend.fail({StatusCode: 401, Results: "Price must be a number"})
    } else if ( product.UnitPrice < 0) {
        return res.jsend.fail({StatusCode: 401, Results: "Price must be larger than zero"})
    }

    if ( isNaN(product.Quantity)) {
        return res.jsend.fail({StatusCode: 401, Results: "Quantity must be a number"})
    } else if ( product.Quantity < 0 ) {
        return res.jsend.fail({StatusCode: 401, Results: "Quantity must be larger than zero"})
    }

    try {
        await productService.updateProduct(product);
        return res.jsend.success({ StatusCode: 200, Results: "Update successful" });
    } catch (error) {
        console.log(error)
        return res.jsend.fail({ StatusCode: 500, Results: error });
    }
});

// Only soft delete - Setting IsDeleted: 1
router.delete("/", auth.token, auth.isAdmin, async function (req, res, next) {
/*  #swagger.tags = ["Products"]
    #swagger.description = "Soft delete a product (setting IsDeleted = 1)"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/DeleteProduct"
        }
	}
*/

    const id = req.body.id;

    const product = await productService.getProduct(id);
    if (!product) {
        return res.jsend.fail({ StatusCode: 500, Results: "Product not found" });
    }

    try {
        await productService.deleteProduct(id);
        return res.jsend.success({ StatusCode: 200, Results: "Delete Successful" });
    } catch (error) {
        return res.jsend.fail({ StatusCode: 500, Results: "Error during delete", error: error });
    }
});

module.exports = router;
