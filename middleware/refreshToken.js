const Users = require("../src/model/userModel.js")
const jwt = require("jsonwebtoken")

const refreshToken = async(req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findOne({
            where:{
                token_refresh: refreshToken
            }
        });
        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user.id;
            const first_name = user.first_name;
            const last_name = user.last_name;
            const email = user.email;
            const accessToken = jwt.sign({userId, first_name, last_name, email}, process.env.SECRET_TOKEN, {
                expiresIn: '30s'
            });
            res.json({accessToken});
        });    
    } catch (error) {
        console.log(error)
    }
}

module.exports = refreshToken