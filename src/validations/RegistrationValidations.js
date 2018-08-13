let RegistrationValidations = {
  validateRegistration: function({ name, country, phone, email, password, repeatPassword }, i18n) {
    let errors = [];

    if (name === '') {
      errors.push(["name", i18n.registration.errors.invalidName]);
    }

    if (country === null) errors.push(['country', i18n.registration.errors.invalidCountry]);

    if (phone.length < 9) errors.push(['phone', i18n.registration.errors.invalidPhone]);

    if (password.length < 6)
      errors.push(['password', i18n.registration.errors.passwordMinLenght]);

    if (password !== repeatPassword) errors.push(['password', i18n.registration.errors.passwordDidNotMatch]);

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      errors.push(['email', i18n.registration.errors.invalidEmail]);

    return errors;
  },
};

export default RegistrationValidations;
