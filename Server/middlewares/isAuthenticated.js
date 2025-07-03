import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Please login to continue",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode.userid) {
            return res.status(401).json({
                message: "Invalid token payload",
                success: false
            });
        }

        req.id = decode.userid;
        next();
    } catch (error) {
        console.error("isAuthenticated error:", error);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};

export default isAuthenticated;