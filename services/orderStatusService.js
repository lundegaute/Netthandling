class OrderStatusService {
    constructor(db) {
        this.Client = db.sequelize;
        this.OrderStatus = db.OrderStatus
    }

    async getNewOrderStatus () {
        return this.OrderStatus.findOne({
            where: {
                id: 1,
            }
        })
    }

    async getOrderStatus() {
        return this.OrderStatus.findAll({
            where: {},
            order: [["id", "asc"]]
        })
    }

    async createStatus ( status ) {
        return this.OrderStatus.create({
            Status: status
        })
    }

    async updateStatusNames(id, newStatus) {
        return this.OrderStatus.update(
            {
                Status: newStatus
            },
            {
                where: {
                    id: id
                }
            }
        )
    }

}

module.exports = OrderStatusService;