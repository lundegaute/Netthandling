class OrderService {
    constructor(db) {
        this.Client = db.sequelize;
        this.Order = db.Order;
        this.OrderStatus = db.OrderStatus
        this.Membership = db.Membership
        this.Product = db.Product
    }

    async getUserOrders(userId) {
        return this.Order.findAll({
            where: {
                UserId: userId
            },
            include: [this.Membership, this.Product, this.OrderStatus]
        })
    }

    async getAllOrders() {
        return this.Order.findAll({
            where: {},
            include: [this.Membership, this.Product, this.OrderStatus]
        })
    }

    async createOrder(cartProduct, user, orderNumber, orderStatus) {
        return this.Order.create({
            OrderNumber: orderNumber,
            Quantity: cartProduct.Quantity,
            UnitPrice: cartProduct.UnitPrice,
            DiscountedPrice: cartProduct.DiscountedPrice,
            MembershipId: user.MembershipId,
            UserId: user.id,
            ProductId: cartProduct.ProductId,
            OrderStatusId: orderStatus.id
        })
    }

    async updateOrderStatus(orderNumber, newStatusId) {
        return this.Order.update(
            {
                OrderStatusId: newStatusId
            },
            {
                where: {
                    OrderNumber: orderNumber
                }
            })
    }


}


module.exports = OrderService;