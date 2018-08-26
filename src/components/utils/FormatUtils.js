export const formatAnimalList = animalList => {
    return animalList.map(value => ({id: value.id, name: `${value.number} ${value.chipNumber ? "(" + value.chipNumber + ")" : ''}`}))
  };