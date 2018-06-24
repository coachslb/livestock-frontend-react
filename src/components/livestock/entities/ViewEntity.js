import React from 'react';
import { Card, CardContent, Typography, Button } from 'material-ui';

const ViewEntity = props => {
  console.log(props);
  const entity = props.entityData;
  return (
    <Card>
      <CardContent>
        <div className="card-header">
          <Typography variant="headline" className="card-header_title">
            Empresa agrícola
          </Typography>
        </div>
        <div className="card-body">
          {entity.name && (
            <div className="card-field col-6">
              <p className="field-info">{entity.name}</p>
              <label className="field-label">Nome</label>
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
              <label className="field-label">Contacto</label>
            </div>
          )}
          {entity.address &&
            entity.address.detail && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.detail}</p>
                <label className="field-label">Morada</label>
              </div>
            )}
          {entity.address &&
            entity.address.postalCode && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.postalCode}</p>
                <label className="field-label">Código postal</label>
              </div>
            )}
          {entity.address &&
            entity.address.district && (
              <div className="card-field col-6">
                <p className="field-info">{entity.address.district}</p>
                <label className="field-label">Distrito</label>
              </div>
            )}
          {entity.country && (
            <div className="card-field col-6">
              <p className="field-info">{entity.country.name}</p>
              <label className="field-label">País</label>
            </div>
          )}
        </div>
        {// eslint-disable-next-line
        ((entity.region && entity.region.name) || entity.nifap) && (
          <div className="card-header">
            <Typography variant="headline" className="card-header_title">
              Dados agrícolas
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
          Editar
        </Button>
      </div>
    </Card>
  );
};

export default ViewEntity;
