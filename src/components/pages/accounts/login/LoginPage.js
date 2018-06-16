import React from 'react';
import { Link } from 'react-router-dom';
import '../accounts.css';
import Login from '../../../accounts/login/Login'
import AccountsFooter from '../../../../components/accounts/AccountsFooter/AccountsFooter';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';

const LoginPage = (props) =>{
    return(
    <div className="container">
        <div className="container-left" >
            <PresentationImage/>
        </div>
        <div className="container-right">
            <div className="logo">
            </div>
            <Login />
            <div style={{marginTop:"20px", marginLeft:"20px"}}>
                <Link to="forgot-password"><p>Esqueceste palavra-passe?</p></Link>
                <Link to="registration"><p>Não tens conta? <strong>Criar conta</strong></p></Link>
            </div>
            <AccountsFooter />
        </div>
    </div>
    ); 
} 

export default LoginPage;