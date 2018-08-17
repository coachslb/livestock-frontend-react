export const errorHandler = e => {
    console.log(e)
    let errors = [];
    if(e)
        e.map(err => errors.push([err.field, err.error]));
    return errors;
  };