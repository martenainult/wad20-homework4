const UserModel = require('../models/UserModel');
const jwt = require("../library/jwt");

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    // Remove the "Bearer" head from header
    let token = request.headers.authorization.split(" ")[1]
    // Check if request senders token is valid
    let veriffic = jwt.verifyAccessToken(token)

    if (veriffic) {
        UserModel.getById(veriffic.id, (user) => {
            request.currentUser = user;
            next();
        });
    } else {
        // if there is no authorization header
        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};