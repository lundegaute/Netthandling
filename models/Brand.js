module.exports = (sequelize, Sequelize) => {
	const Brand = sequelize.define(
		'Brand',
		{
            Brand: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
            },
            
		},
		{
			timestamps: false,
		}
	);

	Brand.associate = function (models) {
		Brand.hasMany(models.Product, {});
	};

	return Brand;
};