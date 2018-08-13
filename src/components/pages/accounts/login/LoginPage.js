import React from 'react';
import { Link } from 'react-router-dom';
import '../accounts.css';
import Login from '../../../accounts/login/Login';
import AccountsFooter from '../../../../components/accounts/AccountsFooter/AccountsFooter';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';

import { I18nContext } from '../../../App';

const LoginPage = props => {
  return (
    <I18nContext.Consumer>
      {({ i18n, changeLanguage, language }) => (
        <div className="container">
          <div className="container-left">
            <PresentationImage />
          </div>
          <div className="container-right">
            <div className="logo" />
            <Login i18n={i18n} language={language}/>
            <div style={{ marginTop: '20px', marginLeft: '20px' }}>
              <Link to="forgot-password">
                <p>{i18n.login.forgotPassword}</p>
              </Link>
              <Link to="registration">
                <p dangerouslySetInnerHTML={{__html: i18n.login.newAccount}} />
              </Link>
            </div>
            <AccountsFooter i18n={i18n} changeLanguage={changeLanguage} language={language} />
          </div>
        </div>
      )}
    </I18nContext.Consumer>
  );
};

export default LoginPage;
