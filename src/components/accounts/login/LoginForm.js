import React from 'react';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import {Icon, Button, IconButton, FormControl} from 'material-ui';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const LoginForm = (props) => {
    return(
    <div className="loginForm">
        <FormControl style={{width:"90%"}}>
            <InputLabel required>Email</InputLabel>
            <Input />
        </FormControl>
        <FormControl style={{marginTop:"20px", width:"90%"}}>
            <InputLabel required>Password</InputLabel>
            <Input
                type='password'
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                        >
                            <VisibilityOff /> 
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
        <Button variant="raised" style={{marginTop: "20px", width: "40%"}} color="primary">
            Entrar
            <Icon>arrow</Icon>
        </Button> 
    </div>
    );
}

export default LoginForm;