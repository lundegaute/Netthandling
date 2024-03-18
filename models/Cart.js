module.exports = (sequelize, Sequelize) => {
	const Cart = sequelize.define(
		'Cart',
		{
            Quantity: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: false
            },
			UnitPrice: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: false
			},
            
		},
		{
			timestamps: true,
		}
	);

	Cart.associate = function (models) {
		Cart.belongsTo(models.User, {});
		Cart.belongsTo(models.Product, {});
		
	};

	return Cart;
};