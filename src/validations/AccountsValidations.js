let AccountsValidations = {
  validateLogin: function(email, password) {
    
    let errors = [];

    if (password === null || password === '') errors.push(['password', 'Password is required']);

    if (email === null || email === '')
      errors.push(['email', 'Email is required!']);

    return errors;
  },
  validateForgotPassword: function(email) {
    
    let errors = [];

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      errors.push(['email', 'Email address invalid!']);

    return errors;
  },
};

export default AccountsValidations;
