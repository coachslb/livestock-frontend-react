import React, { Component } from 'react';
import { Card, CardContent, Typography, Button } from 'material-ui';
import { formatDate } from '../../utils/dateUtils';
import '../../pages/livestock/license/license.css';
import BuyLicense from './BuyLicense';

const licenseName = (type, i18n) => {
  switch (type) {
    case 0:
      return i18n.freePlan;
    case 1:
      return i18n.freePlan;
    case 2:
      return i18n.basePlan;
    case 3:
      return i18n.premiumPlan;
    default:
      return i18n.freePlan;
  }
};

const licensePrice = type => {
  switch (type) {
    case 0:
      return 0.0;
    case 1:
      return 0.0;
    case 2:
      return 9.99;
    default:
      return 19.99;
  }
};

class CurrentLicenseCardInfo extends Component {
  render() {
    const { i18n, license, worker, handleCloseDialog } = this.props;
    return (
      <Card className="current-license-card">
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            borderRight: '1px solid grey',
          }}
        >
          <Typography variant="title" color="primary" style={{ flexGrow: 1 }}>
            {i18n.currentLicense}
          </Typography>
          <div className="current-license-info">
            <Typography variant="display1">{licenseName(license.licenseType, i18n)}</Typography>
            <Typography variant="body2">
              {license.active
                ? `${formatDate(license.beginDate)} - ${formatDate(license.endDate)} (${
                    license.active
                  })`
                : i18n.noLicense}
            </Typography>
          </div>
        </CardContent>
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            justifyContent: 'center',
          }}
        >
          <div className="current-license-buttons">
            {license.active ? (
              <Button
                size="medium"
                variant="raised"
                color="primary"
                className="card-button"
                onClick={() => (
                  <BuyLicense
                    licenseType={license.licenseType}
                    basePrice={licensePrice(license.licenseType)}
                    nif={worker.nif}
                    name={worker.name}
                    handleCloseDialog={() => handleCloseDialog}
                  />
                )}
              >
                {i18n.button.renew}
              </Button>
            ) : (
              <Typography variant="body2">{i18n.noLicense}</Typography>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default CurrentLicenseCardInfo;
