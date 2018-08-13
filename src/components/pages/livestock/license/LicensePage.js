import React, { Component, Fragment } from 'react';
import CurrentLicenseCardInfo from '../../../livestock/license/CurrentLicenseCardInfo';
import LicensePlanCard from '../../../livestock/license/LicensePlanCard';
import { CircularProgress } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import LicenseService from '../../../../services/LicenseService';
import { I18nContext } from '../../../App';
import './license.css';

class LicensePage extends Component {
  constructor() {
    super();
    this.state = {
      license: null,
      isLoading: null,
      serverError: null,
    };
  }

  componentWillMount() {
    const entityId = localStorage.getItem('entityId');
    this.setState({ isLoading: true });

    if (entityId) {
      const getActiveLicenseResponse = LicenseService.getActiveLicense(entityId, true);

      getActiveLicenseResponse
        .then(res => {
          this.setState({ license: res.data, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const { license, isLoading, serverError } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && license && (
                <Fragment>
                  {license && (
                      <CurrentLicenseCardInfo
                        i18n={i18n.license}
                        license={license}
                      />
                    )}
                  <div className="license-plans-container">
                    <LicensePlanCard i18n={i18n.license.free} />
                    <LicensePlanCard i18n={i18n.license.base} />
                    <LicensePlanCard i18n={i18n.license.premium} />
                  </div>
                </Fragment>
              )}
            {isLoading && (
              <CircularProgress
                style={{
                  height: '80px',
                  width: '80px',
                  top: '50%',
                  left: '50%',
                  position: 'fixed',
                }}
              />
            )}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default LicensePage;
