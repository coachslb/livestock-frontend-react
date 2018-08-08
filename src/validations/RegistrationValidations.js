let RegistrationValidations = {
  validateRegistration: function({ name, country, phone, email, password, repeatPassword }) {
    let errors = [];

    if (name === '') {
      errors.push(["name", "Nome inválido"]);
    }

    if (country === null) errors.push(['country', 'country invalid']);

    if (phone.length < 9) errors.push(['phone', 'Contacto obrigatório']);

    if (password.length < 6)
      errors.push(['password', 'a palavra-passe tem um tamanho minímo de 6 caracteres']);

    if (password !== repeatPassword) errors.push(['password', 'As palavras-passe não combinam']);

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
      errors.push(['email', 'E-mail inválido!']);

    return errors;
  },
};

export default RegistrationValidations;
