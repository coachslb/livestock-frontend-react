import React from 'react';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import ChangePassword from '../../../accounts/changePassword/ChangePassword';
import { I18nContext } from '../../../App';
import '../accounts.css';

const ChangePasswordPage = () => {
  return (
    <I18nContext.Consumer>
      {({ i18n, language }) => (
        <div className="container">
          <div className="container-left">
            <PresentationImage />
          </div>
          <div className="container-right">
            <ChangePassword i18n={i18n} language={language} />
          </div>
        </div>
      )}
    </I18nContext.Consumer>
  );
};

export default ChangePasswordPage;
