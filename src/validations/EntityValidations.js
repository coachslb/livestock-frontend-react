let EntityValidations = {
    validateCreateEntity: function(name, country) {
      let errors = [];
    
      if (name == null || name === '') {
        errors.push(["name", "name invalid"]);
      }
  
      if (country === null) errors.push(['country', 'country invalid']);

      return errors;
    },
  };
  
  export default EntityValidations;