import React from 'react';
import { FormControl, InputLabel, Input, FormHelperText, InputAdornment } from 'material-ui';
import { Field } from 'react-final-form';

const InputForm = ({ name, style, required, label, type, step, inputAdornment, disabled, value, fullWidth }) => (
  <Field
    name={name}
    render={({ input, meta }) => {
      if (type === 'date' && input.value !== ''){
        input.value = new Date(input.value).toJSON().slice(0, 10);
      }
        return (
          <FormControl style={style} error={meta.touched && meta.error ? true : false} fullWidth={fullWidth}>
            <InputLabel required={required}>{label}</InputLabel>
            <Input {...input} type={type} value={value ? value : input.value} disabled={disabled} step={step} endAdornment={inputAdornment ? <InputAdornment position="end">{inputAdornment}</InputAdornment> : undefined}  />
            {meta.touched &&
              meta.error && <FormHelperText id="name-error-text">{meta.error}</FormHelperText>}
          </FormControl>
        )
    }}
  />
);

export default InputForm;
