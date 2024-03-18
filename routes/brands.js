var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var db = require("../models");
var BrandService = require("../services/brandService");
var brandService = new BrandService(db);
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var auth = require("../middleware/authenticate");
router.use(jsend.middleware);


router.get("/", async function ( req ,res, next ) { 
/*  #swagger.tags = ["Brands"]
    #swagger.description = "Get all brands in database"
*/

    const brands = await brandService.getBrands();

    if ( brands.length === 0 ) {
        return res.jsend.fail({StatusCode: 500, Results: "No brands found"})
    }

    return res.jsend.success({StatusCode: 200, Results: brands});
})


router.post("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Brands"]
    #swagger.description = "Create brand. Brand can be anything execpt for a number"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/CreateBrand"
        }
	}
*/

    const brandNameRegex = /^[\w\s.,-]{2,100}$/; // All letters, numbers, whitespace and punctuation
    const brand = req.body.brand;

    if ( !isNaN(brand)) {
        return res.jsend.fail({StatusCode: 401, Results: "Brand name can not be a number"})
    }

    if ( !brandNameRegex.test(brand)) {
        return res.jsend.fail({StatusCode: "Invalid brand name"})
    }
    try {
        await brandService.createBrand(brand);
        return res.jsend.success({StatusCode: 200, Results: "Brand Created"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 401, Results: "Brand name already in database", Error: error})
    }
})


router.put("/", auth.token, auth.isAdmin, async function (req, res, next ) {
/*  #swagger.tags = ["Brands"]
    #swagger.description = "Updart brand name using brand name as the key"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateBrand"
        }
	}
*/ 
    
    const {id, updatedBrand} = req.body;
    const brandNameRegex = /^[\w\s.,-]{2,100}$/; // All letters, numbers, whitespace and punctuation

    if ( !await brandService.getBrandById(id)) {
        return res.jsend.fail({StatusCode: 500, Results: "Invalid brand id"})
    }

    if ( !isNaN(updatedBrand)) {
        return res.jsend.fail({StatusCode: 401, Results: "Brand name can not be a number"})
    }

    if ( !brandNameRegex.test(updatedBrand)) {
        return res.jsend.fail({StatusCode: "Invalid brand name"})
    }
 
    try {
        await brandService.updateBrand(id, updatedBrand);
        return res.jsend.success({StatusCode: 200, Results: "Brand updated"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 401, Results: "Brand name already in database", Error: error.errors})
    }
})

router.delete("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Brands"]
    #swagger.description = "Delete a brand, if its not active on any products"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/DeleteBrand"
        }
	}
*/

    const brand = req.body.brand;
    const products = await productService.queryProducts();

    if ( !await brandService.getBrandByName(brand)) { // If brand name is not in database, we go here
        return res.jsend.fail({StatusCode: 401, Results: "Brand name invalid"})
    }

    for ( let product of products ) {
        if ( product.Brand === brand) { // Checking if brand is assigned to a product. If so, we go here
            return res.jsend.fail({StatusCode: 500, Results: "Can not delete brand assigned to a product"})
        }
    }

    try {
        await brandService.deleteBrand(brand);
        return res.jsend.success({StatusCode: 200, Results: "Brand deleted"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Error during brand deletion", error: error})
    }
    
    
})


module.exports = router;