module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define(
		'Product',
		{
            Name: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
            },
            Description: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
            },
            UnitPrice: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: false
            },
            imgurl: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
            },
            Quantity: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: false
            },
            IsDeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
				allowNull: false,
                unique: false
            },
            
		},
		{
			timestamps: true,
		}
	);

	Product.associate = function (models) {
		Product.belongsTo(models.Brand, {});
		Product.belongsTo(models.Category, {});
        Product.hasMany(models.Cart)
        Product.hasMany(models.Order, {})
	};
	return Product;
};