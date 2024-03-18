class CartService {
    constructor(db) {
        this.Client = db.sequelize
        this.Cart = db.Cart
        this.Product = db.Product
    }

    async getCart(user) {
        return this.Cart.findAll({
            where: {
                UserId: user.id
            },
            include: [this.Product]

        })
    }

    async getProductById(productId, user) {
        return this.Cart.findOne({
            where: {
                ProductId: productId,
                UserId: user.id
            }
        })
    }

    async addToCart( productToAdd, product, user ) {
        return this.Cart.create({
            Quantity: productToAdd.quantity,
            UnitPrice:  product.UnitPrice,
            UserId: user.id,
            ProductId: productToAdd.productId
        })
    }


    async updateCart(productToUpdate, user) {
        return this.Cart.update(
            {
                Quantity: productToUpdate.quantity
            }, 
            {
                where: {
                    UserId: user.id,
                    ProductId: productToUpdate.productId
                }
            })
    }

    
    async deleteCartProduct ( userId, productId ) {
        return this.Cart.destroy({
            where: {
                UserId: userId,
                ProductId: productId,
            }
        })
    }
    
    async deleteCart( user ) {
        return this.Cart.destroy({
            where: {
                UserId: user.id
            }
        })
    }

}

module.exports = CartService;