import jwt from "jsonwebtoken"

export const generateToken = (userID, res) => {

    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn:"7d"})
    res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}