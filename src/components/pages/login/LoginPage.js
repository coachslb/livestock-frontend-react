import React, { Component } from 'react';
import './login.css';
import LoginForm from '../../accounts/login/LoginForm';
import AccountsFooter from '../../accounts/AccountsFooter/AccountsFooter';

class LoginPage extends Component{

    render(){
        const imgStyle = {float: "left", marginTop: "40px"}
        return(
        <div className="container">
            <div className="container-left">
                <img src ="http://localhost:3000/imgs/login_background_img.jpg" alt="" height="100%" width="100%"/>
            </div>
            <div className="container-right">
                <img src ="http://localhost:3000/imgs/logo-Agroop.png" alt="" height="42" width="100" style={imgStyle}/>
                <LoginForm />
                <div style={{marginTop:"20px"}}>
                    <p>Esqueceste palavra-passe?</p>
                    <p>Não tens conta? <strong>Criar conta</strong></p>
                </div>
                <AccountsFooter />
            </div>
        </div>
        );
    }
} 

export default LoginPage;