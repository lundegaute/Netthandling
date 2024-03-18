class CategoryService {
    constructor(db) {
        this.Client = db.sequelize
        this.Category = db.Category
    }

    async getAllCategories() {
        return this.Category.findAll({
            where: {},
            order: [["id", "asc"]]
        })
    }

    async getCategoryById(id) {
        return this.Category.findOne({
            where: {
                id: id
            }
        })
    }

    async createCategory (category) {
        return this.Category.create({
            Category: category
        })
    }

    async getCategoryByName(category) {
        return this.Category.findOne({
            where: {
                Category: category
            }
        })
    }

    async updateCategory(id, category) {
        return this.Category.update(
            {
                Category: category,
            },
            {
                where: {
                    id: id
                }
            })
    }

    async deleteCategory(category) {
        return this.Category.destroy({
            where: {
                Category: category
            }
        })
    }

}

module.exports = CategoryService;