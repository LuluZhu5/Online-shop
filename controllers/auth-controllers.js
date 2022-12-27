const User = require('../models/user-model');

function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res) {
    const userInfo = req.body;
    const user = new User(
        userInfo.email,
        userInfo.password,
        userInfo.fullname,
        userInfo.street,
        userInfo.postal,
        userInfo.city
    );
    await user.signUp();

    res.redirect('/login');
}

function getLogin(req, res) {
    res.render('customer/auth/login')
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,

}