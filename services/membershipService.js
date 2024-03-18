class MembershipService {
    constructor(db) {
        this.Client = db.sequelize;
        this.Membership = db.Membership;
    }

    async getMemberships () {
        return this.Membership.findAll({
            where: {},
            order: [["id"]]
        })
    }
    
    async createMembership(status, discount) {
        return this.Membership.create({
            Status: status,
            Discount: discount,
        })
    }

    async updateMembership(id, newStatus, newDiscount) {
        return this.Membership.update(
            {
                Status: newStatus,
                Discount: newDiscount
            },
            {
                where: {
                    id: id
                }
            }
        )
    }

    async deleteMembership(id) {
        return this.Membership.destroy({
            where: {
                id: id
            }
        })
    }



}

module.exports = MembershipService;