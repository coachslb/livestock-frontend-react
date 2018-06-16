import React from 'react';
import { Link } from 'react-router-dom';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import ForgotPassword from '../../../accounts/forgotPassword/ForgotPassword';
import AccountsFooter from '../../../accounts/AccountsFooter/AccountsFooter';
import CloseIcon from '@material-ui/icons/Close';
import '../accounts.css';

const ForgotPasswordPage = () => {
    return(
    <div className="container">
        <div className="container-left" >
            <PresentationImage/>
        </div>
        <div className="container-right">
            {/* <img src ="http://localhost:3000/imgs/logo-Agroop.png" alt="" height="42" width="100" style={imgStyle}/> */}
            <div className="sidebar_header">
                <Link to="login"><CloseIcon className="sidebar_icon--left"/></Link>
            </div>
            <ForgotPassword />
            <AccountsFooter />
        </div>
    </div>);
}

export default ForgotPasswordPage;