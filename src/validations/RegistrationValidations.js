let RegistrationValidations = {
  validateRegistration: function({ name, country, phone, email, password, repeatPassword }) {
    let errors = [];

    if (name === '') {
      errors.push(["name", "name invalid"]);
    }

    if (country === null) errors.push(['country', 'country invalid']);

    if (phone.length < 9) errors.push(['phone', 'phone number invalid']);

    if (password.length < 6)
      errors.push(['password', 'Password has a minimum size of 6 characters']);

    if (password !== repeatPassword) errors.push(['password', 'Passwords did not match']);

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      errors.push(['email', 'Email address invalid!']);

    return errors;
  },
};

export default RegistrationValidations;
