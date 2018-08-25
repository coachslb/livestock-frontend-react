import React from 'react';
import { FormControlLabel, Switch } from 'material-ui';
import { Field } from 'react-final-form';

const SwitchForm = ({ name, style, label, value, onChange, color }) => (
  <Field
    name={name}
    render={({ input, meta }) => {
        return (
            <FormControlLabel style={style}
            control={
              <Switch
                checked={value}
                onChange={onChange}
                value={value}
                color={color ? color : 'primary'}
              />
            }
            label={label}
          />
        )
    }}
  />
);

export default SwitchForm;