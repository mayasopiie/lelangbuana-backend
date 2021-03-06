const models = require('../../models')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const user = models.user
const Op = Sequelize.Op

const controller = {

    //-------------------------------------------------------------------------------------------
    get: async (req, res, next) => {
        user.findAll()
            .then(users => {
                res.status(200).send({
                    users
                })
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    getById: async (req, res, next) => {
        const { user_id } = req.params
        user.findById(user_id)
            .then(user => {
                if (user) {
                    res.status(200).send({
                        user
                    })
                } else {
                    res.send({
                        message: 'User not found'
                    })
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })

    },

    //-------------------------------------------------------------------------------------------
    getByUsername: async (req, res, next) => {
        const { username } = req.params
        user.findOne({
            where: {
                username
            }
        })
            .then(user => {
                if (user) {
                    res.status(200).send({
                        user
                    })
                } else {
                    res.send({
                        message: 'User not available'
                    })
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })

    },

    //-------------------------------------------------------------------------------------------
    searchByUsername: async (req, res, next) => {
        const searchedUser = String(req.query.q).toLowerCase()
        if (searchedUser) {
            user.findAll({
                where: {
                    username: {
                        [Op.like]: `%${searchedUser}%`
                    }
                }
            })
                .then(users => {
                    if (users) {
                        res.status(200).send(users)
                    } else {
                        res.status(400).send(errorMessage('User not found'))
                    }
                })
        } else {
            res.status(400).send(errorMessage('Please fill your keyword'))
        }
    },

    //-------------------------------------------------------------------------------------------
    register: async (req, res, next) => {
        const {
            username,
            password,
            first_name,
            last_name,
            profile_photo,
            email,
            id_card,
            phone_number,
            address,
            city,
            province,
            zip_code,
            country,
            status
        } = req.body
        const saltRounds = 1

        bcrypt
            .hash(password, saltRounds)
            .then(password => {
                return {
                    username,
                    password,
                    first_name,
                    last_name,
                    profile_photo,
                    email,
                    id_card,
                    phone_number,
                    address,
                    city,
                    province,
                    zip_code,
                    country,
                    status
                }
            })
            .then(newUser => {
                user.build(newUser)
                    .save()
                    .then((err, user) => {
                        const response = {
                            message: `User is successfully registered`,
                            username
                        }
                        res.status(200).send(response)
                    })
                    .catch(error =>
                        res.status(409).send({
                            message: 'User is alredy registered'
                        })
                    )
            })
            .catch(error =>
                res.status(500).send({
                    message: `Registration failed`
                })
            )
    },

    // ---------------------------------------------------------------------------
    login: async (req, res, next) => {
        const {
            username,
            password
        } = req.body

        if (username && password) {
            user.findOne({
                where: {
                    username: username
                }
            }).then(user => {
                bcrypt.compare(password, user.password).then(response => {
                    if (response) {
                        const token = jwt.sign({
                            iat: Math.floor(Date.now() / 1000) - 30,
                            data: {
                                user_id: user.user_id // from mysql
                            }
                        },
                            process.env.JWT_SECRET || 'codingtogether', {
                                expiresIn: '1d'
                            }
                        )

                        res.status(200).send({
                            message: `User is successfully logged in`,
                            token
                        })
                    } else {
                        res.send({
                            message: `Username or password is wrong`
                        })
                    }
                })
            })
        } else {
            res.status(400).send({
                message: `Username and password are not provided`
            })
        }
    },

    //-------------------------------------------------------------------------------------------
    updateUser: async (req, res, next) => {
        const user_id = req.params
        user.update({
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile_photo: req.body.profile_photo,
            email: req.body.email,
            id_card: req.body.id_card,
            phone_number: req.body.phone_number,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            zip_code: req.body.zip_code,
            country: req.body.country,
            status: req.body.status,
            created_at: new Date()
        }, {
                where: {
                    user_id
                }
            })
            .then(user => {
                res.status(200).send({
                    user
                })
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Update user failed'
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    deleteUser: async (req, res, next) => {
        const user_id = req.params
        user.destroy({
            where: {
                user_id
            }
        })
            .then(user => {
                res.status(200).send({
                    user
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Delete user failed'
                })
            })
    },

    // ---------------------------------------------------------------------------
    logout: async (req, res, next) => {
        res.send({
            message: `User is successfully logged out`
        })
    }
}

module.exports = controller;