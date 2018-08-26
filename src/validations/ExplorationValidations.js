let ExplorationValidations = {
  validateCreateOrUpdateExploration: function(name, types, i18n) {
    let errors = [];

    if (name == null || name === '') {
      errors.push(['name', i18n.exploration.errors.invalidName]);
    }

    if (types === null || !types.length > 0) errors.push(['types', i18n.exploration.errors.fieldRequired]);

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
    i18n
  ) {
    let errors = [];

    if (name === null || name === '') errors.push(['name', i18n.exploration.errors.invalidName]);

    if (number === null || number === '' || isNaN(number))
      errors.push(['number', i18n.exploration.errors.fieldRequired]);

    if (
      placeType === null ||
      placeType === '' ||
      placeTypes.find(type => placeType === type.id) === null
    )
      errors.push(['placeType', i18n.exploration.errors.invalidPlaceType]);

    /* if (
      soilType === null ||
      soilType === '' ||
      soilTypes.find(type => soilType === type.id) === null
    )
      errors.push(['soilType', i18n.exploration.errors.invalidSoilType]); */

    if (isNaN(area) || area < 0) errors.push(['area', i18n.exploration.errors.invalidArea]);

    return errors;
  },
  validateCreateOrUpdateAnimal: function(
    chipNumber,
    animalType,
    animalTypes,
    sex,
    sexList,
    birthDate,
    i18n
  ) {
    let errors = [];

    if (chipNumber === null || chipNumber === '')
      errors.push(['chipNumber', i18n.exploration.errors.fieldRequired]);

    if (
      animalType === null ||
      animalType === '' ||
      animalTypes.find(type => animalType === type.id) === null
    )
      errors.push(['animalType', i18n.exploration.errors.invalidAnimalType]);

    if (sex === null || sex === '' || sexList.find(type => sex === type.id) === null)
      errors.push(['sex', i18n.exploration.errors.invalidSexType]);

    return errors;
  },
  validateCreateOrUpdateGroup: function(name, place, placeList, i18n) {
    let errors = [];

    if (name === null || name === '') errors.push(['name', i18n.exploration.errors.invalidName]);

    if (place === null || place === '' || placeList.find(type => place === type.id) === null)
      errors.push(['place', i18n.exploration.errors.invalidPlace]);

    return errors;
  },
};

export default ExplorationValidations;
