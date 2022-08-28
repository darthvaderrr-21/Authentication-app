const express = require('express')
const authController = require('../controllers/authController')


function initRoutes(app) {
    app.get('/', (req, res)=> {
        res.render('register')
    })

    app.get('/login', authController().login);
    app.get('/register', authController().register);

    app.post('/login', authController().postLogin);
    app.post('/register', authController().postRegister);

    app.post('/logout', authController().logout);

    app.get('/dashboard', (req, res)=> {
        res.render('dashboard')
    });
}

module.exports = initRoutes