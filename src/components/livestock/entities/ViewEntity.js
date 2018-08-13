import React from 'react';
import { Card, CardContent, Typography, Button } from 'material-ui';

const ViewEntity = props => {
  const entity = props.entityData;
  const {i18n} = props;
  return (
    <Card>
      <CardContent>
        <div className="card-header">
          <Typography variant="headline" className="card-header_title">
            {i18n.entity.agricolaEntity}
          </Typography>
        </div>
        <div className="card-body">
          {entity.name && (
            <div className="card-field col-6">
              <p className="field-info">{entity.name}</p>
              <label className="field-label">{i18n.entity.name}</label>
            </div>
          )}
          {entity.nif && (
            <div className="card-field col-6">
              <p className="field-info">{entity.nif}</p>
              <label className="field-label">NIF</label>
            </div>
          )}
          {entity.email && (
            <div className="card-field col-6">
              <p className="field-info">{entity.email}</p>
              <label className="field-label">E-mail</label>
            </div>
          )}
          {entity.phone && (
            <div className="card-field col-6">
              <p className="field-info">{entity.phone}</p>
              <label className="field-label">{i18n.entity.phone}</label>
            </div>
          )}
          {entity.address &&
            entity.address.detail && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.detail}</p>
                <label className="field-label">{i18n.entity.address}</label>
              </div>
            )}
          {entity.address &&
            entity.address.postalCode && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.postalCode}</p>
                <label className="field-label">{i18n.entity.postalCode}</label>
              </div>
            )}
          {entity.address &&
            entity.address.district && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.district}</p>
                <label className="field-label">{i18n.entity.district}</label>
              </div>
            )}
          {entity.country && (
            <div className="card-field col-6">
              <p className="field-info">{entity.country.name}</p>
              <label className="field-label">{i18n.entity.country}</label>
            </div>
          )}
        </div>
        {// eslint-disable-next-line
        ((entity.region && entity.region.name) || entity.nifap) && (
          <div className="card-header">
            <Typography variant="headline" className="card-header_title">
              {i18n.entity.agricolaData}
            </Typography>
          </div>
        )}
        <div className="card-body">
          {entity.region &&
            entity.region.name && (
              <div className="card-field col-6">
                <p className="field-info">{entity.region.name}</p>
                <label className="field-label">DRAP</label>
              </div>
            )}
          {entity.nifap && (
            <div className="card-field col-6">
              <p className="field-info">{entity.nifap}</p>
              <label className="field-label">NIFAP</label>
            </div>
          )}
        </div>
      </CardContent>
      <div className="card-actions">
        <Button
          size="medium"
          variant="raised"
          color="primary"
          className="card-button"
          onClick={props.onClick}
        >
          {i18n.entity.edit}
        </Button>
      </div>
    </Card>
  );
};

export default ViewEntity;
