class BrandService {
    constructor(db) {
        this.Client = db.sequelize
        this.Brand = db.Brand

    }

    async getBrands() {
        return this.Brand.findAll({
            where: {},
            order: [["id", "asc"]]
        })
    }

    async getBrandById(id) {
        return this.Brand.findOne({
            where: {
                id: id
            }
        })
    }

    async getBrandByName(brand) {
        return this.Brand.findOne({
            where: {
                Brand: brand
            }
        })
    }

    async createBrand (brand) {
        return this.Brand.create({
            Brand: brand
        })
    }

    async updateBrand (id, brand) {
        return this.Brand.update(
            {
                Brand: brand,
            }, 
            {
                where: {
                    id: id
                }
            }
        )
    }

    async deleteBrand (brand) {
        return this.Brand.destroy({
            where: {
                Brand: brand
            }
        })
    }

}

module.exports = BrandService;