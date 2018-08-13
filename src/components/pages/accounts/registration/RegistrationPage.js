import React from 'react';
import { Link } from 'react-router-dom';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import AccountsFooter from '../../../accounts/AccountsFooter/AccountsFooter';
import Registration from '../../../accounts/registration/Registration';
import CloseIcon from '@material-ui/icons/Close';
import '../accounts.css';
import { I18nContext } from '../../../App';

const RegistrationPage = () => {
  return (
    <I18nContext.Consumer>
      {({ i18n, language, changeLanguage }) => (
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
            <Registration i18n={i18n} language={language}/>
            <AccountsFooter i18n={i18n} changeLanguage={changeLanguage} language={language}/>
          </div>
        </div>
      )}
    </I18nContext.Consumer>
  );
};

export default RegistrationPage;
