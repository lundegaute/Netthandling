var express = require("express");
var router = express.Router();
var db = require("../models");
var CategoryService = require("../services/categoryService");
var categoryService = new CategoryService(db);
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var jsend = require("jsend");
var auth = require("../middleware/authenticate");
router.use(jsend.middleware);


router.get("/", async function ( req, res, next ) {
/*  #swagger.tags = ["Categories"]
    #swagger.description = "Get all categories in database"
    
*/

    const categories = await categoryService.getAllCategories();

    return res.jsend.success({StatusCode: 200, Results: categories})
});

router.post("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Categories"]
    #swagger.description = "Create new category. Can be anything except for a number"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/CreateCategory"
        }
	}
*/

    const categoryNameRegex = /^[\w\s.,-]{2,100}$/;
    const category = req.body.category;

    if ( !categoryNameRegex.test(category)) {
        return res.jsend.fail({StatusCode: 401, Results: "Invalid category name"})
    }
    
    if ( !isNaN(category)){
        return res.jsend.fail({StatusCode: 401, Results: "Category name can not be number"})
    }

    try {
        await categoryService.createCategory(category);
        return res.jsend.success({StatusCode: 200, Results: "Category created"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 401, Results: "Category name already in database"})
    }
})

router.put("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Categories"]
    #swagger.description = "Update category"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateCategory"
        }
	}
*/

    const {id, updatedCategory} = req.body;
    const categoryNameRegex = /^[\w\s.,-]{2,100}$/;

    if ( !await categoryService.getCategoryById(id)) {
        return res.jsend.fail({StatusCode: 500, Results: "Invalid id! No category found"})
    }

    if ( !categoryNameRegex.test(updatedCategory)) {
        return res.jsend.fail({StatusCode: 401, Results: "Invalid category name"})
    }

    if ( !isNaN(updatedCategory)){
        return res.jsend.fail({StatusCode: 401, Results: "Category name can not be number"})
    }

    try {
        await categoryService.updateCategory(id, updatedCategory);
        return res.jsend.success({StatusCode: 200, Results: "Category updated"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 401, Results: "Category name already in database"})
    }
})

router.delete("/", auth.token, auth.isAdmin, async function ( req, res, next ) {
/*  #swagger.tags = ["Categories"]
    #swagger.description = "Delete category based on category name"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/DeleteCategory"
        }
	}
*/

    const category = req.body.category;
    const products = await productService.queryProducts();
    console.log(category)
    
    
    if ( !await categoryService.getCategoryByName(category)) {
        return res.jsend.fail({StatusCode: 500, Results: "Invalid category name! No category found"})
    }

    for ( let product of products ) {
        if ( product.Category === category) {
            return res.jsend.fail({StatusCode: 500, Results: "Can not delete category already assigned to product"})
        }
    }
    try {
        await categoryService.deleteCategory(category);
        return res.jsend.success({StatusCode: 200, Results: "Category deleted"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: error})
    }
})


module.exports = router;