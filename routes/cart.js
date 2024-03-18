var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var db = require("../models");
var CartService = require("../services/cartService");
var cartService = new CartService(db);
var ProductService = require("../services/productService");
var productService = new ProductService(db);
var OrderService = require("../services/orderService");
var orderService = new OrderService(db);
var OrderStatusService = require("../services/orderStatusService");
var orderStatusService = new OrderStatusService(db);
var UserService = require("../services/userService");
var userService = new UserService(db);
var auth = require("../middleware/authenticate");
var orderNumberGenerator = require("../middleware/orderNumberGenerator");
router.use(jsend.middleware);


router.get("/", auth.token, auth.isUser, async function ( req, res, next) {
/*  #swagger.tags = ["Cart"]
    #swagger.description = "Get logged in user cart"
*/

    const userCart = await cartService.getCart(req.user);
    const user = req.user;
    const userData = await userService.getUsername(user.Username)
    if ( userCart.length === 0 ) { // if cart has nothing in it, we kindly as the user to pls buy something
        return res.jsend.success({StatusCode: 200, Results: "Your cart is empty, pls buy something"})
    }

    let totalCost = userCart.reduce( (sum, cartProduct) => {
        return sum + (parseInt(cartProduct.UnitPrice) * parseInt(cartProduct.Quantity));
    }, 0)

    let discountedTotal = totalCost - ( totalCost * userData.Membership.Discount); // calculating discount on the price total
    
    return res.jsend.success({StatusCode: 200, Results: userCart, TotalCost: totalCost, DiscountedPrice: discountedTotal})
})


router.post("/", auth.token, auth.isUser, async function ( req, res, next ) {
/*  #swagger.tags = ["Cart"]
    #swagger.description = "Create new category"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/AddToCart"
        }
	}
*/

    const user = req.user;
    const productToAdd = req.body;
    const product = await productService.getProduct(productToAdd.productId);
    const userCart = await cartService.getCart(req.user)

  
    if ( !productToAdd.productId || !productToAdd.quantity ) { // If one or both fields are empty, we go here
        console.log("Empty fields!")
        return res.jsend.fail({StatusCode: 401, Results: "Fields can not be empty"})
    }

    if ( !product ) { // If product does not exist, we go here
        return res.jsend.fail({StatusCode: 500, Results: "Product not found"})
    }


    if ( product.Quantity < productToAdd.quantity ) { // If storage quantity is less than users desired quantity, we go here
        return res.jsend.fail({StatusCode: 500, Results: "Insufficient stock quantity. Please adjust or choose another product"})
    }

    
    for ( let cartProduct of userCart) { // If product is in user cart, we update quantity
        if ( productToAdd.productId == cartProduct.ProductId ) { 
            productToAdd.quantity = parseInt(cartProduct.Quantity) + parseInt(productToAdd.quantity);

            if ( productToAdd.quantity > product.Quantity ) { // Checking quantity of items in cart + items to add to cart, if higher than stock quantity, we go here
                return res.jsend.fail({StatusCode: 500, Results: "Insufficient stock quantity. Please adjust or choose another product"})
            }

            await cartService.updateCart(productToAdd, user)
            return res.jsend.success({StatusCode: 200, Results: "Product quantity updated"})
        }
    }

    try {
        await cartService.addToCart(productToAdd, product, user)
        return res.jsend.success({StatusCode: 200, Results: "Product added to user cart"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Error when adding cart product, pls try again", error: error})
    }
})

 
router.post("/checkout", auth.token, auth.isUser, async function ( req, res, next ) {
/*  #swagger.tags = ["Cart"]
    #swagger.description = "Checkout logged in user cart"
*/

    const user = req.user;
    const userData = await userService.getUsername(user.Username);
    const products = await productService.queryProducts();
    const userCart = await cartService.getCart(user)
    const orderStatus = await orderStatusService.getNewOrderStatus();
    const orderNumber = orderNumberGenerator(8);

    if ( userCart.length === 0 ) { // If cart is empty, we go in here
        return res.jsend.fail({StatusCode: 500, Results: "Unable to checkout empty cart, pls buy something"})
    }

    userCart.forEach( (cartProduct) => { // Calculate discount for every product in the
        cartProduct.dataValues.DiscountedPrice = cartProduct.UnitPrice - ( cartProduct.UnitPrice * userData.Membership.Discount);
    })

    // Check if product quantity is still available at purchase
    let productQuantityUpdateList = [];

    for ( let cartProduct of userCart ) {
        let product = await productService.getProduct(cartProduct.ProductId)
        
        if ( product.Quantity < cartProduct.Quantity) { // Comparing quantity. If not enough in stock, we go in here
            return res.jsend.fail({StatusCode: 500, Results: `Insufficient stock quantity on ${product.Name}. Please adjust or choose another product`})
        } else { // Calculating left over quantity and pushing object into productQuantityUpdateList
            let newQuantity = product.Quantity - cartProduct.Quantity
            productQuantityUpdateList.push( {ProductId: product.id, NewQuantity: newQuantity} )
        }
    }
    
    
    
    
    try { // If any error occurs during order creation, we catch it and show a message to the user
        for ( let cartProduct of userCart) {
            await orderService.createOrder(cartProduct.dataValues, userData, orderNumber, orderStatus)
        }
    } catch (error) {
        return res.jsend.error({StatusCode: 500, message: "Error during order creation, pls try again", error: error})
    }
   
    // Updating product stock quantity after order has successfully been created
    for ( let productAndQuantity of productQuantityUpdateList) {
        await productService.updateQuantity(productAndQuantity)
    }
    
    // updating user purchases in database
    let userPurchases = await userService.getUserPurchases(user)
    let purchases = userCart.reduce( (sum, cartProduct) => {
        return sum + cartProduct.Quantity;
    }, userPurchases.Purchases )

    await userService.updatePurchase(user.Email, purchases)

    // Updating membership status after the order has gone through
    if ( purchases >= 30 ) {
        await userService.updateMembershipStatus(3, user) // Updating to gold status
        console.log(`IN THE STATUS UPGRADE ${user}`)
    } else if ( purchases >= 15 ) {
        await userService.updateMembershipStatus(2, user) // Updating to silver status
    } else {
        await userService.updateMembershipStatus(1, user)
    }

    try {
        await cartService.deleteCart(user); // Deleting content of the userCart based on userId
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: "Error when deleting cart, pls try again"})
    }

    return res.jsend.success({StatusCode: 200, Results: "Order successfuly completed"})

})


router.put("/", auth.token, auth.isUser, async function ( req, res, next ) {
/*  #swagger.tags = ["Cart"]
    #swagger.description = "Update Cart product quantity"
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/UpdateCartProduct"
        }
	}
*/

    const productToUpdate = req.body;
    const user = req.user;
    const userCart = await cartService.getCart(user)
    const product = await productService.getProduct( productToUpdate.productId );
    const productInCart = await cartService.getProductById( productToUpdate.productId, user);

    if ( userCart.length === 0) {
        return res.jsend.fail({StatusCode: 500, Results: "Cart is empty, pls buy something"})
    }
    
    if ( !productInCart ) {
        return res.jsend.fail({StatusCode: 500, Results: "Invalid update! Product not found in user cart"})
    }
    
    if ( productToUpdate.quantity === "") {
        return res.jsend.fail({StatusCode: 500, Results: "Invalid update! Quantity must be 0 or higher"})

    }

    if ( productToUpdate.quantity == 0) {
        await cartService.deleteCartProduct(user.id, productToUpdate.productId);
        return res.jsend.success({StatusCode: 200, Results: "Product removed from cart"})
    }


    
    if ( product.Quantity < ( parseInt( productToUpdate.quantity ) + parseInt( productInCart.Quantity )) ) {
        return res.jsend.fail({StatusCode: 500, Results: "Insufficient stock quantity"})
    }
    productToUpdate.quantity = parseInt( productToUpdate.quantity ) + parseInt( productInCart.Quantity )
    await cartService.updateCart( productToUpdate, user )
    return res.jsend.success({StatusCode: 200, Results: "Update successful"})


})


router.delete("/", auth.token, auth.isUser, async function ( req, res, next ) {
/*  #swagger.tags = ["Cart"]
    #swagger.description = "Delete Cart product."
    #swagger.parameters["bodies"] = {
		"name": "body",
		"in": "body",
		"schema": {
            $ref: "#/definitions/DeleteCartProduct"
        }
	}
*/
    
    const productId = req.body.productId;
    const user = req.user;
    const userCart = await cartService.getCart(user);
    
    if ( userCart.length === 0) {
        return res.jsend.fail({StatusCode: 500, Results: "Cart is empty, pls buy something"})
    }
    
    for ( let cartProduct of userCart) {
        if ( cartProduct.Product.id == productId){
            await cartService.deleteCartProduct(user.id, productId);
            return res.jsend.success({StatusCode: 200, Results: "Delete successful"})
        }
    }
    return res.jsend.fail({StatusCode: 500, Restuls: "Product not found in user cart"})

})


module.exports = router;