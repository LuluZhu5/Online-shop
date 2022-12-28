function isEmpty(value) {
    return !value || value.trim() === '';
}

function userDetailsValid(email, password, name, street, postal, city) {
    return (
        email && email.includes('@') && 
        password && password.trim().length >= 6 && 
        !isEmpty(name) && !isEmpty(street) && !isEmpty(postal) && city);
}

function emailisConfirmed(email, confirmed) {
    return email === confirmed;
}

module.exports = {
    userDetailsValid: userDetailsValid,
    emailisConfirmed: emailisConfirmed
};
