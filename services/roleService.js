class RoleService {
    constructor(db) {
        this.Client = db.sequelize;
        this.Role = db.Role;
    }

    async getRoles() {
        return this.Role.findAll({
            where: {}
        })
    }

    async createRole(role) {
        return this.Role.create({
            Role: role,
        })
    }

}

module.exports = RoleService;