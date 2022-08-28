const LocalStrategy = require('passport-local').Strategy
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done)=>{
        // Check if user exists or not:
        const user = await User.findOne({email: email})
        if(!user) {
            return done(null, false, {message: 'No user found!'})
        }

        // Password matching:
        bcrypt.compare(password, user.password).then(match=>{
            if(match){
                return done(null, user, {message: 'LoggedIn successfully'})
            }

            return done(null, false, {message: 'Incorrect email or password!'})

        }).catch(err=>{
            return done(null, false, {message: 'Something went wrong!'})
        })

    }))
    
    passport.serializeUser((user, done)=> {
        done(null, user._id)
    })

    passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {                            // User.findOne({_id: id}, err=>{
            done(err, user)                                          // done(err, user)
        })
    })

}

module.exports = init