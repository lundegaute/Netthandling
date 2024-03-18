module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define(
		'User',
		{
			FirstName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
			},

            LastName: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
            },
            UserName: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true
            },

			Email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},

			EncryptedPassword: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
                unique: false,
			},

			Salt: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
                unique: false,
			},

            Address: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
            },

            TelephoneNumber: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: false
            },
			Purchases: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                unique: false,
			}

		},
		{
			timestamps: false,
		}
	);

	User.associate = function (models) {
		User.belongsTo(models.Membership, {});
		User.hasOne(models.Cart, {});
        User.hasMany(models.Order, {});
		User.belongsTo(models.Role, {})
	};

	return User;
};
