const bcrypt = require("bcrypt")
const Users = require("../model/userModel.js")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")



const getUsers = async(req,res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','first_name','last_name', 'email'],
    });
        res.json(users);
    } catch (error) {
        console.log(error)
        
    }
}

const validate = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required().label("First Name"),
        last_name: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        conPass: Joi.any().equal(Joi.ref('password')).required().messages({
            'any.only': 'Password do not match'
        })    
    });
    return schema.validate(data);
};

const Register = async(req,res) => {
    const { first_name, last_name, email, password } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const user = await Users.findOne({
        where: {email: email} });
    if(user) return res.status(409).json({msg: "Email already exist"})
    
        
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": hashPassword
        });
        return res.json({msg: "User registered successfully"});
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(e => e.message);
            return res.status(400).json({errors: message});
        }
        console.error(error);
    }
};

const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg:"Invalid Password"});
        const userId = user[0].id;
        const first_name = user[0].first_name;
        const last_name = user[0].last_name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, first_name, last_name, email}, process.env.SECRET_TOKEN,{
            expiresIn: '60s'
        });
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({msg:"Email does not find"});
    }
};

const sendEmail = (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const token = jwt.sign({ email: user.email }, process.env.SECRET_TOKEN, { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetLink}`);
        res.status(200).json({ msg: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
};

const Logout = async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendstatus(204);
    const user = await Users.findAll({
        where:{
            token_refresh: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null}, {
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};

module.exports = {
    getUsers,
    validate,
    Register,
    Login,
    forgotPassword,
    Logout
}