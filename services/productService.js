class ProductService {
    constructor(db) {
        this.Client = db.sequelize;
        this.Product = db.Product;
        this.Brand = db.Brand;
        this.Category = db.Category;
    }

    async queryProducts () {
        const query = `
            SELECT DISTINCT products.*, brands.Brand, categories.Category FROM products 
            JOIN brands ON brands.id = products.BrandId 
            JOIN categories ON categories.id = products.CategoryId 
            ORDER BY products.id`;
        return this.Client.query(query, {type: this.Client.QueryTypes.SELECT})
    }

   async searchProducts( userSearch ) {
        const query = `
            SELECT DISTINCT products.*, brands.Brand, categories.Category FROM products 
            JOIN brands ON brands.id = products.BrandId 
            JOIN categories ON categories.id = products.CategoryId
            WHERE products.Name LIKE :userSearch
            OR categories.Category = :categorySearch  
            OR brands.Brand = :brandSearch
            ORDER BY products.id`
            return this.Client.query(query, {
                replacements: { 
                    userSearch: `%${userSearch}%`,
                    categorySearch: userSearch,
                    brandSearch: userSearch,
                },
                type: this.Client.QueryTypes.SELECT
            });
   }

    async getProduct(id) {
        console.log(id)
        return this.Product.findOne({
            where: {
                id: id
            }
        })
    }

    async getProductByName(name) {
        return this.Product.findOne({
            where: {
                Name: name
            }
        })
    }

    async createProduct ( product ) {
        return this.Product.create({
            Name: product.Name,
            Description: product.Description,
            UnitPrice: product.UnitPrice,
            imgurl: product.imgurl,
            Quantity: product.Quantity,
            IsDeleted: 0,
            BrandId: product.BrandId,
            CategoryId: product.CategoryId,
        })
    }

    async updateProduct ( product ) {
        return this.Product.update(
            {
                Name: product.Name,
                Description: product.Description,
                UnitPrice: product.UnitPrice,
                imgurl: product.imgurl,
                Quantity: product.Quantity,
                IsDeleted: product.IsDeleted,
                BrandId: product.BrandId,
                CategoryId: product.CategoryId,
            }, 
            {
                where: {
                    id: product.id
                }
            }
        );
    }

    async updateQuantity(productAndQuantity){
        return this.Product.update(
            {
                Quantity: productAndQuantity.NewQuantity,
            }, 
            {
                where: {
                    id: productAndQuantity.ProductId,
                }
            }
        )
    }

    async deleteProduct (id) {
        return this.Product.update(
            {
                IsDeleted: 1
            },
            {
                where: {
                    id: id
                }
            }
        )
    }

}

module.exports = ProductService;