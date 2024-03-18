module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        "Order",
        {
            OrderNumber: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: false,
            },
            Quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                unique: false,
            },
            UnitPrice: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                unique: false,
            },
            DiscountedPrice: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                unique: false,
            }
        },
        {
            timestamps: true,
        }
    );

    Order.associate = function (models) {
        Order.belongsTo(models.Membership, {});
        Order.belongsTo(models.User, {});
        Order.belongsTo(models.Product, {});
        Order.belongsTo(models.OrderStatus, {});
    };

    return Order;
};
