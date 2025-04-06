const jwt = require('jsonwebtoken');
const db = require('../lib/db');

const authMiddleware = async (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1]; 
        // console.log(token);
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const query = `SELECT * FROM Users WHERE user_id = ?`;
        const user = await db.promise().query(query, [decode.id]);
        // console.log(decode);
        // console.log(user[0]);
        if(user.length === 0){
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user[0];
        // console.log(user[0]);
        next();
    }
    catch (error) {
        console.log("Error in auth middleware", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { authMiddleware };