var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var jsend = require("jsend");
var jwt = require("jsonwebtoken");
var db = require("../models");
var auth = require("../middleware/authenticate");
var UserService = require("../services/userService");
var userService = new UserService(db);
var createEncryptPassword = require("../middleware/createEncryptedPassword");
router.use(jsend.middleware);


router.post("/register", async function (req, res, next) {
/*  #swagger.tags = ["Auth"]
    #swagger.description = "Register a new user"
    #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/Signup"
        }
    }
*/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
    const namesRegex = /^[a-åA-Å]{2,}$/; // must be 2 letters or more
    const usernameRegex = /^[\w]{2,}/; // must be 2 letters or more
    const addressNameRegex = /^[\w\s.,-]{2,100}$/; // All letters, numbers, whitespace and punctuation
    const telephoneRegex = /^[0-9]{3,8}$/; // Only numbers and must be 3-8 digits long
    const user = req.body;
    const emptyFields = [];

    // Example - key: Email, value: Batman@gmail.com - If value is empty, we add key to the emptyFields list
    for ( let [key, value] of Object.entries(user)) {
        if ( !value || value == "") {
            let words = key.split(/(?=[A-Z])/); // split key on capital letters
            let emptyField = words.map( (word) => { return word[0].toUpperCase()+word.slice(1)}).join(" "); // capitalize first letter in each word and joins into a string
            emptyFields.push(`${emptyField} can not be empty`)
        }
    }
    if ( emptyFields.length > 0 ) { // If list is not empty, we show an error message, with all the fields that need filling
        return res.jsend.fail({StatusCode: 400, Results: emptyFields})
    }

    //Checking format validation on req.body variables
    if ( !namesRegex.test(user.firstName) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid first name! Only letters are accepted"})
    }
    if ( !namesRegex.test(user.lastName) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid last name! Only letters are accepted"})
    }    
    if ( !usernameRegex.test(user.userName) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid username! Only letters and numbers are accepted"})
    }
    if ( !emailRegex.test(user.email) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid email! Example: correct@email.com"})
    }
    if ( !addressNameRegex.test(user.address) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid address!"})
    }
    if ( !telephoneRegex.test(user.telephoneNumber) ) {
        return res.jsend.fail({StatusCode: 400, Results: "Invalid telephone number! Must be only numbers and 8 digits"})
    }

    // checking username/email availability
    const duplicateEmail = await userService.getUserEmail(user.email);
    const duplicateUsername = await userService.getUsername(user.userName);

    if ( duplicateUsername ) { // If username is taken, we show error message
        return res.jsend.fail({StatusCode: 500, Results: "Username already in use"})
    } else if ( duplicateEmail ) { // If email is taken, we show error message
        return res.jsend.fail({StatusCode: 500, Results: "Email already in use"})
    }

    // All user data is acceptable. Now creating encrypted password
    try {
        const encryptedData = await createEncryptPassword(user.password);
        user.encryptedPassword = encryptedData.encryptedPassword;
        user.salt = encryptedData.salt;
        await userService.createUser(user)
        return res.jsend.success({StatusCode: 200, Results: "User created"})
    } catch (error) {
        return res.jsend.fail({StatusCode: 500, Results: error.errors})
    }

});

router.post("/login", async function ( req, res, next ){
/*  #swagger.tags = ["Auth"]
    #swagger.description = "Login with username or email and password"
    #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/Login"
        }
    }
*/

    const { emailOrUsername, password } = req.body;
    let user;
    if ( emailOrUsername.includes("@") ) { // checking if logging in with email or username
        const email = emailOrUsername;
        user = await userService.getUserEmail(email);
        if ( !user ) { // If no user is found, email was wrong
            return res.jsend.fail({StatusCode: 401, Results: "Invalid email"})
        }

    } else {
        const username = emailOrUsername;
        user = await userService.getUsername(username);
        if ( !user ){ // if no user was found, username was wrong
            return res.jsend.fail({StatusCode: 401, Results: "Invalid username"})
        }

    }
    
    crypto.pbkdf2( password, user.Salt, 310000, 32, "sha256", async function (err, hashedPassword) {
        if ( err ) {
            return res.jsend.fail({ StatusCode: 500, Results: `Error on login: ${err}` })
        }
        
        if (!crypto.timingSafeEqual(user.EncryptedPassword, hashedPassword)) {
            return res.jsend.fail({StatusCode: 401, Results: "Password incorrect"})
        }

        let token = jwt.sign( 
            {   id: user.id, 
                Username: user.UserName, 
                Email: user.Email, 
                Role: user.Role.Role, 
                MembershipId: user.MembershipId,
                Discount: user.Membership.Discount,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "2h"}
        )
       
        let userInfo = { id: user.id, Email: user.Email, UserName: user.UserName }; // logged in user, without sensitive data
        res.jsend.success({StatusCode: 200, Results: "Login Successful", Token: token, user: userInfo})
        
    })
})


router.put("/", async function ( req, res, next ) {
/*  #swagger.tags = ["Auth"]
    #swagger.description = "Changing role value on a user. Only Admin can change this"
    #swagger.parameters['body'] =  {
        "name": "body",
        "in": "body",
        "schema": {
            $ref: "#/definitions/UpdateUserRole"
        }
    }
*/

    const {id, newRole} = req.body;
    console.log(id)
    console.log(newRole)
    try {
        await userService.changeRole(id, newRole);
        return res.jsend.success({StatusCode: 200, Results: "Role Updated"})
    } catch (error) {
        console.log(error)
        return res.jsend.fail({StatusCode: 500, Results: "Error during role change", Error: error})
    }
})

module.exports = router;
