const jwt = require('jsonwebtoken');

const auth = {
    token: async ( req, res, next ) => {
        let token;
        if ( req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        } else if ( req.cookies.token) {
            token = req.cookies.token
        } else {
            return res.jsend.fail({StatusCode: 500, "Results": "No token found"})
        }

    jwt.verify( token, process.env.TOKEN_SECRET, ( err, decodedToken) => {
        if ( err ) { // if token is invalid, we go here
            return res.jsend.fail({StatusCode: 500, Results: "Invalid Token"})
        }
        req.user = decodedToken;
        console.log(req.user);
        next();
    })
    },

    isAdmin: async ( req, res, next ) => {
        if ( req.user.Role === "Admin") {
            next();
            return
        } else {
            return res.jsend.fail({StatusCode: 500, Results: "Unauthorized access"})
        }
    },


    isUser: async ( req, res, next ) => {
        if ( req.user.Role === "User" || req.user.Role === "Admin") {
            next();
            return
        } else {
            return res.jsend.fail({StatusCode: 500, Results: "Unauthorized"})
        }
    }
}

module.exports = auth;