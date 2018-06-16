import React from 'react';
import { Button } from 'material-ui';

const SubmitButton = ({children, variant, style, color}) => {
    return(
        <Button
            variant={variant}
            style={style}
            color={color}
            type="submit"
          >
           {children}
          </Button>
    );
}

export default SubmitButton;