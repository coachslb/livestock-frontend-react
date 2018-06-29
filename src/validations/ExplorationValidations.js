let ExplorationValidations = {
  validateCreateOrUpdateExploration: function(name, types) {
    let errors = [];

    if (name == null || name === '') {
      errors.push(['name', 'Nome inválido']);
    }

    if (types === null || !types.length > 0) errors.push(['types', 'Campo obrigatório']);

    return errors;
  },
  validateCreateOrUpdatePlace: function(
    name,
    number,
    placeType,
    placeTypes,
    soilType,
    soilTypes,
    area,
  ) {
    let errors = [];
    console.log(placeType)
    console.log(placeTypes)

    if (name === null || name === '') errors.push(['name', 'Campo obrigatório']);

    if (number === null || number === '' || isNaN(number)) errors.push(['number', 'Campo numérico']);

    if (placeType === null || placeType === '' || placeTypes.find(type => placeType === type.id) === null)
      errors.push(['placeType', 'Tipo de local inválido']);

    if (soilType === null || soilType === '' || soilTypes.find(type => soilType === type.id) === null)
      errors.push(['soilType', 'Tipo de solo inválido']);

    if(isNaN(area) || area < 0)
      errors.push(['area', 'Área inválida']);

      console.log(errors)
    return errors;
  },
};

export default ExplorationValidations;
