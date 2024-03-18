class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Role = db.Role;
    }

    async getUsers() {
        return this.User.findAll({
            where: {},
            include: [this.Role, this.Membership]
        });
    }

    async getUserEmail(email) {
        return this.User.findOne({
            where: {
                Email: email,
            },
            include: [this.Role, this.Membership]
        });
    }

    async getUsername(username) {
        return this.User.findOne({
            where: {
                UserName: username,
            },
            include: [this.Role, this.Membership]
        });
    }

    async getUserPurchases(user) {
        return this.User.findOne({
            where: {
                id: user.id
            },
            attributes: ["Purchases"]
        })
    }

    async createUser( user ) {
        this.User.create({
            FirstName: user.firstName,
            LastName: user.lastName,
            UserName: user.userName,
            Email: user.email,
            EncryptedPassword: user.encryptedPassword,
            Salt: user.salt,
            Address: user.address,
            TelephoneNumber: user.telephoneNumber,
            RoleId: 2,
            Purchases: 0,
            MembershipId: 1,
        });
    }

    async createAdmin ( admin ) {
        return this.User.create({
            FirstName: admin.firstName,
            LastName: admin.lastName,
            UserName: admin.userName,
            Email: admin.email,
            EncryptedPassword: admin.encryptedPassword,
            Salt: admin.salt,
            Address: admin.address,
            TelephoneNumber: admin.telephoneNumber,
            RoleId: 1,
            Purchases: 0,
            MembershipId: 1,
        })
    }

    async updatePurchase(email, newPurchase) {
        await this.User.update(
            {
                Purchases: newPurchase,
            },
            {
                where: {
                    Email: email,
                },
            }
        );
    }

    async updateMembershipStatus(statusId, user) {
        return this.User.update(
            {
                MembershipId: statusId
            },
            {
                where: {
                    id: user.id
                }
            })
    }

    async changeRole(id, newRole) {
        return this.User.update(
            {
                RoleId: newRole
            },
            {
                where: {
                    id: id
                }
            })
    }

}

module.exports = UserService;
