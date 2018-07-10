import React from 'react';
import { FormControl, InputLabel, Input, FormHelperText } from 'material-ui';

const InputField = ({ label, onChange, name, style, required, type, errorMessage }) => {
  return (
    <FormControl style={style} error={errorMessage != null && errorMessage.length > 0}>
      <InputLabel required={required}>{label}</InputLabel>
      <Input name={name} onChange={onChange} type={type} />
      {errorMessage != null &&
        errorMessage.length > 0 && (
          <FormHelperText id="name-error-text">{errorMessage.map(msg => msg[1])}</FormHelperText>
        )}
    </FormControl>
  );
};

export default InputField;


