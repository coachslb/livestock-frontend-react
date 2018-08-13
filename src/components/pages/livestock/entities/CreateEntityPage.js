import React from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import PresentationImage from '../../../UI/PresentationImage/PresentationImage';
import CreateEntity from '../../../../components/livestock/entities/CreateEntity';
import '../../accounts/accounts.css';
import { I18nContext } from '../../../App';

const CreateEntityPage = props => {
  return (
    <I18nContext.Consumer>
      {({ i18n }) => (
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
            <CreateEntity i18n={i18n}/>
          </div>
        </div>
      )}
    </I18nContext.Consumer>
  );
};

export default CreateEntityPage;
