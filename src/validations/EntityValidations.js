let EntityValidations = {
    validateCreateEntity: function(name, country, i18n) {
      let errors = [];
    
      if (name == null || name === '') {
        errors.push(["name", i18n.entity.errors.invalidName]);
      }
  
      if (country === null) errors.push(['country', i18n.entity.errors.invalidCountry]);

      return errors;
    },
    validateGetOneEntity: function(entityId, i18n) {
      let errors = [];
    
      if (entityId == null || entityId === '') {
        errors.push(["entityId", ""]);
      }

      return errors;
    },
  };
  
  export default EntityValidations;