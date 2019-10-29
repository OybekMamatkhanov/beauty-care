
const isEmpty = (data) => {
    if (data.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;    
};

exports.signUpValidation = (userData) => {
    let errors = {};

    if (isEmpty(userData.email)) {
        errors.email = 'Email Must not be empty';
    } else if (!isEmail(userData.email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(userData.password)) errors.password = 'Password must not be empty';

    if (userData.password !== userData.confirmPassword) 
        errors.confirmPassword = 'Password must be match';
    
    if (isEmpty(userData.username)) errors.username = ' Username must not be empty'

    return {
        errors,
        valid: Obeject.keys(errors).length === 0 ? true : false
    };
    
};

exports.logInValidationData = (userData) => {

};