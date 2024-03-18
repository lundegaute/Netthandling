module.exports = (sequelize, Sequelize) => {
	const OrderStatus = sequelize.define(
		'OrderStatus',
		{
            Status: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			timestamps: false,
		}
	);

	OrderStatus.associate = function (models) {
		OrderStatus.hasMany(models.Order, {})
	};

	return OrderStatus;
};