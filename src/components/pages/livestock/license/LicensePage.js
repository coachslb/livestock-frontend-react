import React, { Component, Fragment } from 'react';
import CurrentLicenseCardInfo from '../../../livestock/license/CurrentLicenseCardInfo';
import LicensePlanCard from '../../../livestock/license/LicensePlanCard';
import { CircularProgress } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import LicenseService from '../../../../services/LicenseService';
import BuyLicense from '../../../livestock/license/BuyLicense';
import { I18nContext } from '../../../App';
import './license.css';
import WorkerService from '../../../../services/WorkerService';

class LicensePage extends Component {
  constructor() {
    super();
    this.state = {
      license: null,
      worker: null,
      isLoading: null,
      serverError: null,
      licenseType: null,
      price: null,
      buyLicenseDialog: null,
    };
  }

  componentWillMount() {
    const entityId = localStorage.getItem('entityId');
    const workerId = localStorage.getItem('workerId');
    this.setState({ isLoading: true });

    if (entityId) {
      const getActiveLicenseResponse = LicenseService.getActiveLicense(entityId, true);
      const getUserEntityResponse = WorkerService.getWorker(workerId, true);

      getUserEntityResponse
        .then(res => {
          this.setState({ worker: res.data });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));

      getActiveLicenseResponse
        .then(res => {
          this.setState({ license: res.data, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onDialogClose = e => {
    this.setState({ serverError: null, buyLicenseDialog: null });
  };

  buyLicense = (e, type, price) => {
    this.setState({ buyLicenseDialog: true, licenseType: type, price: price });
  };

  render() {
    const {
      license,
      isLoading,
      serverError,
      buyLicenseDialog,
      licenseType,
      price,
      worker,
    } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading &&
              license && (
                <Fragment>
                  {license && (
                    <CurrentLicenseCardInfo
                      i18n={i18n.license}
                      license={license}
                      worker={worker}
                      handleCloseDialog={this.onDialogClose}
                    />
                  )}
                  <div className="license-plans-container">
                    <LicensePlanCard
                      i18n={i18n.license.free}
                      licenseType={1}
                      basePrice={0.0}
                      buyLicense={this.buyLicense}
                    />
                    <LicensePlanCard
                      i18n={i18n.license.base}
                      buyLicense={this.buyLicense}
                      licenseType={2}
                      basePrice={9.99}
                    />
                    <LicensePlanCard
                      i18n={i18n.license.premium}
                      buyLicense={this.buyLicense}
                      licenseType={3}
                      basePrice={19.99}
                    />
                  </div>
                </Fragment>
              )}
            {buyLicenseDialog && (
              <BuyLicense
                licenseType={licenseType}
                basePrice={price}
                nif={worker.nif}
                name={worker.name}
                handleCloseDialog={this.onDialogClose}
              />
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
