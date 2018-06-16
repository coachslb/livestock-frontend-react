import React from 'react';
import { Link } from 'react-router-dom';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import AccountsFooter from '../../../accounts/AccountsFooter/AccountsFooter';
import Registration from '../../../accounts/registration/Registration';
import CloseIcon from '@material-ui/icons/Close';
import '../accounts.css';

const RegistrationPage = () => {
    return(
    <div className="container">
        <div className="container-left" >
            <PresentationImage/>
        </div>
        <div className="container-right">
            <div className="sidebar_header">
                <Link to="login"><CloseIcon className="sidebar_icon--left"/></Link>
            </div>
            <Registration />
            <AccountsFooter />
        </div>
    </div>
    );
}

export default RegistrationPage;