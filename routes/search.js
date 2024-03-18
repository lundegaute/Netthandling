var express = require("express");
var router = express.Router();
var db = require("../models");
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var jsend = require("jsend");
router.use(jsend.middleware);


router.post("/", async function ( req, res, next ) {
/*  #swagger.tags = ["Search"]
    #swagger.description = "Search for product names (full names not needed), Brand names and Category name (Full name needed)"
    #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/Search"
        }
    }
*/
    try {
        const userSearch = req.body.userSearch;
        const products = await productService.searchProducts(userSearch);
        const numberOfProducts = products.length;
        return res.jsend.success({StatusCode: 200, Results: products, numberOfProducts: numberOfProducts})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Error during search, pls try again", error: error})
    }
})



module.exports = router;