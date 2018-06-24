let ExplorationValidations = {
    validateCreateOrUpdateExploration: function(name, types) {
      let errors = [];
    
      if (name == null || name === '') {
        errors.push(["name", "Nome inválido"]);
      }
  
      if (types === null || !types.length > 0) errors.push(['types', 'Campo obrigatório']);

      return errors;
    },
  };
  
  export default ExplorationValidations;