const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_SECRET_KEY


// register/sign up 
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            res.status(409).json({ message: 'User with this email already exists' })
            return
        }

        const user = new User({ name, email, password: hashedPass, ispremiumuser: false })
        await user.save()
        res.status(201).json(user)

    } catch (err) {
        console.error(err.message)
        console.error(err.stack)
        res.status(500).json({ message: 'internal server error' })
    }
}


//login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userDetails = await User.findOne({ email: email })

        if (!userDetails) {
            res.status(404).json({ message: 'wrong email' })

        } else {
            const correctPass = await bcrypt.compare(password, userDetails.password)
            if (correctPass) {
                //generate a jwt token
                const token = jwt.sign({ userId: userDetails.id }, secretKey, { expiresIn: '1h' })
                req.headers.authorization = token

                // Include user information in the response
                const user = {
                    id: userDetails.id,
                    email: userDetails.email,
                    name: userDetails.name,
                    ispremiumuser: userDetails.ispremiumuser
                };
                res.status(200).json({ message: 'User login successful', token, user })
            } else {
                res.status(401).json({ message: 'wrong password' })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
    }
}


const getUser = async (req, res) => {
    try {
        // Get the user ID from the JWT token
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;

        // Retrieve the user information from the database
        const userDetails = await User.findOne({ where: { id: userId } });

        if (!userDetails) {
            res.status(404).json({ message: 'User not found' });
        } else {
            // Include user information in the response
            const user = {
                id: userDetails.id,
                email: userDetails.email,
                name: userDetails.name,
                ispremiumuser: userDetails.ispremiumuser
            };
            res.status(200).json(user);
        }
    } catch (err) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
};





const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, secretKey)
}


module.exports = {
    createUser,
    login,
    getUser,
    generateAccessToken
}