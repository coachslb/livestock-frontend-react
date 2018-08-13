let AccountsValidations = {
  validateLogin: function(email, password, i18n) {
    
    let errors = [];

    if (password === null || password === '') errors.push(['password', i18n.changePassword.requiredPassword]);

    if (email === null || email === '')
      errors.push(['email', i18n.login.requiredEmail]);

    return errors;
  },
  validateForgotPassword: function(email, i18n) {
    
    let errors = [];

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      errors.push(['email', i18n.accountsGeneral.emailInvalid]);

    return errors;
  },
  validateChangePassword: function(password, repeatPassword, i18n) {
    let errors = [];

    if (password === null || password === '') errors.push(['password', i18n.changePassword.requiredPassword]);
    if (repeatPassword === null || repeatPassword === '') errors.push(['repeatPassword', i18n.changePassword.requiredPassword]);
    if(password !== repeatPassword) errors.push(['password', i18n.changePassword.passwordDidNotMatch]);

    return errors;
  },
};

export default AccountsValidations;
