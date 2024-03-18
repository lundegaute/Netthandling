
const request = require("supertest");
const URL = "http://localhost:3000";
require("dotenv").config();
let token;

describe("Testing CRUD operations on categories", () => {
    
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

    test("Post /categories create category", async () => {
        const testCategory = "TEST_CATEGORY";

        const response = await request(URL)
        .post("/categories")
        .send({category: testCategory})
        .set("authorization", "Bearer " + token);
        expect(response.body.data.StatusCode).toEqual(200);
    })
    

    test("Delete /categories delete a category", async () => {

        const categories = await request(URL)
        .get("/categories")
        let categoryToDelete = categories.body.data.Results[categories.body.data.Results.length - 1].Category
        const response = await request(URL)
        .delete("/categories")
        .send({category: categoryToDelete})
        .set("authorization", "Bearer " + token);
        console.log(response.body.data.Results)
        expect(response.body.data.StatusCode).toEqual(200);
    })


    test("Get /categories", async () => {
        const response = await request(URL).get("/categories");
        console.log(response.body.data.Results)
        expect(response.body.data.StatusCode).toEqual(200);
    });
    
    
})