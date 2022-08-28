const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return{
        login(req,res){
            res.render('login')
        },
        
        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info)=> {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/dashboard')

                })
            })(req, res, next)            
        },

        register(req,res){
            res.render('register')
        },

        async postRegister(req,res){
            const{ name, email, password } = req.body
            // console.log(req.body)
            // Validating request
            if(!name || !email || !password) {
                req.flash('error', 'All fields are mandatory!')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // User already exist
            User.exists({email, email}, (err,result)=> {
                if(result){
                    req.flash('error', 'Email already exist!')
                    req.flash('name', name)
                    res.redirect('/register')
                }
            })

            // Making password encrypted
            const hashedpassword = await bcrypt.hash(password, 10)

            // Creating a new user
            const user = new User({
                name,               // name: name,
                email,              // email: email,
                password: hashedpassword
            })

            user.save().then((user)=> {
                // Login
                return res.redirect('/login')
            }).catch(err=>{
                req.flash('error', 'Something went wrong!')
            })

        },

        logout(req,res, next) {
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/register');
            });
        }
    }
}

module.exports = authController