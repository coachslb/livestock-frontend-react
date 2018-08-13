import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from 'material-ui';
import { Field } from 'react-final-form';

const SelectForm = ({ name, style, required, label, list, isLanguage }) => (
  <Field
    name={name}
    render={({ input, meta }) => (
      <FormControl style={style} error={meta.touched && meta.error ? true : false}>
        <InputLabel required={required}>{label}</InputLabel>
        <Select {...input}>
          {list.map(value => {
            return (
              <MenuItem key={isLanguage ? value.code : value.id} value={isLanguage ? value.code : value.id}>
                {value.name}
              </MenuItem>
            );
          })}
        </Select>
        {meta.touched &&
          meta.error && <FormHelperText id="name-error-text">{meta.error}</FormHelperText>}
      </FormControl>
    )}
  />
);

export default SelectForm;
