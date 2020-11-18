const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/jwtSecret')

//ANCHOR Signup
exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (user)
            return res.status(400).json({
                message: 'User already registered',
            })

        const { firstName, lastName, email, password } = req.body
        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            userName: Math.random().toString(),
        })

        _user.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: 'Something went wrong',
                    error,
                })
            }

            if (data) {
                return res.status(201).json({
                    message: 'User created successfully',
                    user: data,
                })
            }
        })
    })
}

//ANCHOR Signin
exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) return res.status(400).json({ error })

        if (user) {
            if (user.authenticate(req.body.password) && user.role === 'user') {
                const token = jwt.sign(
                    { _id: user._id, role: user.role },
                    JWT_SECRET,
                    {
                        expiresIn: '1d',
                    }
                )
                const { _id, firstName, lastName, email, role, fullName } = user
                res.status(200).json({
                    token,
                    user: {
                        _id,
                        firstName,
                        lastName,
                        email,
                        role,
                        fullName,
                    },
                })
            } else {
                return res.status(400).json({ message: 'Invalid password' })
            }
        } else {
            return res.status(400).json({ message: 'Something went wrong' })
        }
    })
}

//ANCHOR Signout
exports.signout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: 'Signout successfully',
    })
}

/** exports.test = (req, res) => {
    res.status(200).json({ message: 'test' })
    console.log('test')
}*/
