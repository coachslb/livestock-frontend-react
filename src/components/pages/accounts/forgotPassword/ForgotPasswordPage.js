import React from 'react';
import { Link } from 'react-router-dom';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import ForgotPassword from '../../../accounts/forgotPassword/ForgotPassword';
import AccountsFooter from '../../../accounts/AccountsFooter/AccountsFooter';
import CloseIcon from '@material-ui/icons/Close';
import { I18nContext } from '../../../App';
import '../accounts.css';

const ForgotPasswordPage = () => {
  return (
    <I18nContext.Consumer>
      {({ i18n, changeLanguage, language }) => (
        <div className="container">
          <div className="container-left">
            <PresentationImage />
          </div>
          <div className="container-right">
            <div className="sidebar_header">
              <Link to="login">
                <CloseIcon className="sidebar_icon--left" />
              </Link>
            </div>
            <ForgotPassword i18n={i18n} language={language} />
            <AccountsFooter i18n={i18n} changeLanguage={changeLanguage} language={language} />
          </div>
        </div>
      )}
    </I18nContext.Consumer>
  );
};

export default ForgotPasswordPage;
