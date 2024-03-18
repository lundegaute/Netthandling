const request = require("supertest");
const URL = "http://localhost:3000";
require("dotenv").config();


describe("Login with correct & incorrect user details", () => {

    test("Post /auth/login correct user details", async () => {
        const user = {
            emailOrUsername: "Admin",
            password: "P@ssword2023"
        }

        const data = await request(URL)
        .post("/auth/login")
        .send(user)

        expect(data.body.data.StatusCode).toEqual(200);
    })

    test("Post /auth/login incorrect user details", async () => {
        const user = {
            emailOrUsername: "Invalid",
            password: "Wrong"
        }

        const data = await request(URL)
        .post("/auth/login")
        .send(user)

        expect(data.body.data.StatusCode).toEqual(401)

    })

})