let EntityValidations = {
    validateCreateEntity: function(name, country) {
      let errors = [];
    
      if (name == null || name === '') {
        errors.push(["name", "name invalid"]);
      }
  
      if (country === null) errors.push(['country', 'country invalid']);

      return errors;
    },
    validateGetOneEntity: function(entityId) {
      let errors = [];
    
      if (entityId == null || entityId === '') {
        errors.push(["entityId", "Entity ID is not present"]);
      }

      return errors;
    },
  };
  
  export default EntityValidations;