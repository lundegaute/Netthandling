const request = require("supertest");
const URL = "http://localhost:3000";
require("dotenv").config();
let token;


describe("CRUD operations on products", () => {

    test("Post /auth/login get valid token", async () => {
        const user = {
            emailOrUsername: "Admin",
            password: "P@ssword2023"
        }

        const data = await request(URL)
        .post("/auth/login")
        .send(user);
        token = data.body.data.Token
        expect(data.body.data.StatusCode).toEqual(200);
    })

    test("Post /products create new product", async () => {
        const data = await request(URL)
        .post("/products")
        .send({
            "Name": "TEST_PRODUCT",
            "Description": "3D touch test",
            "UnitPrice": 9999,
            "imgurl": "Test",
            "Quantity": "10",
            "BrandId": "1",
            "CategoryId": "1"
        })
        .set("authorization", "Bearer " + token)
        expect(data.body.data.StatusCode).toEqual(200);
    })

    test("Put /products Update product", async () => {
        const products = await request(URL)
        .get("/products")

        const productId = products.body.data.Results[products.body.data.Results.length - 1].id
        
        const product = {
            "id": productId,
            "Name": "TEST_PRODUCT",
            "Description": "Updated TEST_PRODUCT",
            "UnitPrice": 1000,
            "imgurl": "UPDATEDTest",
            "Quantity": "10",
            "IsDeleted": "0",
            "BrandId": "2",
            "CategoryId": "2"
        }

        const data = await request(URL)
        .put("/products")
        .send(product)
        .set("authorization", "Bearer " + token)
        console.log(data.body.data.Results)
        expect(data.body.data.StatusCode).toEqual(200);

    })

    test("Delete /products soft deleting product", async () => {
        const products = await request(URL)
        .get("/products")
        
        const productId = products.body.data.Results[products.body.data.Results.length - 1].id
        const id = {id: productId}

        const data = await request(URL)
        .delete("/products")
        .send(id)
        .set("authorization", "Bearer " + token)

        expect(data.body.data.StatusCode).toEqual(200);
    })

})