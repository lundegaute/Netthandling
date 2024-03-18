module.exports = (sequelize, Sequelize) => {
	const Membership = sequelize.define(
		'Membership',
		{
            Status: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
            },
			Discount: {
				type: Sequelize.DataTypes.FLOAT,
				allowNull: false,
				unique: false,
			}
            
		},
		{
			timestamps: false,
		}
	);

	Membership.associate = function (models) {
		Membership.hasMany(models.User, {});
		Membership.hasMany(models.Order, {});
		
	};

	return Membership;
};