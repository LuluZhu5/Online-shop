const User = require('../models/user-model');

const authUtil = require('../util/authentication');
const userDetailsValid = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city:''
        };
    }

    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const userInfo = req.body;
    const enteredData = {
        email: userInfo.email,
        confirmEmail: userInfo['confirm-email'],
        password: userInfo.password,
        fullname: userInfo.fullname,
        street: userInfo.street,
        postal: userInfo.postal,
        city: userInfo.city
    }

    if (!userDetailsValid.userDetailsValid(
        userInfo.email,
        userInfo.password,
        userInfo.fullname,
        userInfo.street,
        userInfo.postal,
        userInfo.city) || 
        !userDetailsValid.emailisConfirmed(
        userInfo.email, 
        userInfo['confirm-email'])) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'Please check your input for correct email, password must be at least 6 characters long',
                ...enteredData
            }, function() {
                res.redirect('/signup');
            })
            return;
    }

    const user = new User(
        userInfo.email,
        userInfo.password,
        userInfo.fullname,
        userInfo.street,
        userInfo.postal,
        userInfo.city
    );

    try {
        const isexisted = await user.existAlready();
        if (isexisted) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'email exists already',
                ...enteredData
            }, function() {
                res.redirect('/signup');
            })
            return;
        }

        await user.signUp();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    }
    res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;

    try {
        existingUser = await user.getUserWithEmail();
    } catch(error) {
        next(error);
        return;
    }
    
    const errorObject = {
        errorMessage: 'invalid credentials, please check your email and password',
        email: user.email,
        password: user.password
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, errorObject, function() {
            res.redirect('/login');
        })
        return;
    }
    
    const correctPw = await user.comparePassword(existingUser.password);
    if (!correctPw) {
        sessionFlash.flashDataToSession(req, errorObject, function() {
            res.redirect('/login');
        })
        return;
    }

    authUtil.createUserSession(req, existingUser, function() {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login'); 
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout,
}