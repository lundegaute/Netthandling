const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "eCommerce",
        description: "Documentation for eCommerce Exam Project"
    },
    host: "localhost:3000",
    definitions: {
        Login: {
            $emailOrUsername: "Admin",
            $password: "P@ssword2023"
        },
        Signup: {
            $firstName: "Admin",
            $lastName: "Support",
            $userName: "Admin",
            $email: "Admin@noroff.no",
            $password: "P@ssword2023",
            $address: "Online",
            $telephoneNumber: "911"
        },
        UpdateUserRole: {
            $newRole: "1",
            $id: "1"
        },
        CreateBrand: {
            $brand: "SwaggerBrandTest"
        },
        UpdateBrand: {
            $id: "1",
            $updatedBrand: "NewBrandName"
        },
        DeleteBrand: {
            $brand: "SwaggerBrandTest"
        },
        CreateCategory: {
            $category: "SwaggerCategoryTest"
        },
        UpdateCategory: {
            $id: "1",
            $updatedCategory: "NewCategoryName"
        },
        DeleteCategory: {
            $category: "SwaggerCategoryTest"
        },
        CreateProduct: {
            $Name: "Any text",
            $Description: "Any text",
            $UnitPrice: "999",
            $imgurl: "Any text",
            $Quantity: "10",
            $BrandId: "1",
            $CategoryId: "1",
        },
        UpdateProduct: {
            $id: "17",
            $Name: "Updated Product Name",
            $Description: "Updated",
            $UnitPrice: "649",
            $imgurl: "Test",
            $Quantity: "10",
            $IsDeleted: "0",
            $BrandId: "1",
            $CategoryId: "5"
        },
        DeleteProduct: {
            $id: "1"
        },
        AddToCart: {
            $productId: "1",
            $quantity: "1"
        },
        UpdateCartProduct: {
            $productId: "1",
            $quantity: "1"
        },
        DeleteCartProduct: {
            $productId: "1",
        },
        UpdateOrderStatus: {
            $newStatus: "2",
            $orderNumber: "orderNumberHere"
        },
        CreatingMembership: {
            $status: "StatusName",
            $discount: "50"
        },
        UpdateMembership: {
            $id: "1",
            $newStatus: "UpdatedStatusName",
            $newDiscount: "40"
        },
        DeleteMembership: {
            $id: "1"
        },
        UpdateOrderStatus: {
            $newStatus: "2",
            $orderNumber: "OrderNumberHere"
        },
        Search: {
            $userSearch: "iPhone"
        }
        

    },
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then( () => {
    require('./bin/www');
});