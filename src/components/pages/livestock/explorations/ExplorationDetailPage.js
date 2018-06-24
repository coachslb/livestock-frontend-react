import React, { Component } from 'react';
import { Typography, Card, CardContent, Button } from 'material-ui';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';

function getExplorationTypesFromId(explorationTypes) {
  explorationTypes.sort();
  let first = true;
  return explorationTypes.map(type => {
    if (first) {
      first = false;
      return type;
    } else return ', ' + type;
  });
}

class ExplorationDetailPage extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      agricolaEntityId: 0,
      name: '',
      addressId: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      isLoading: false,
      serverError: false,
      errors: null,
      types: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    let getOneExplorationPromise = ExplorationService.get(this.props.match.params.id, null, true);

    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));

    getOneExplorationPromise
      .then(res => {
        this.setState({
          id: res.data.id ? res.data.id : '',
          agricolaEntityId: res.data.agricolaEntityId ? res.data.agricolaEntityId : '',
          addressId: res.data.address && res.data.address.id ? res.data.address.id : '',
          address: res.data.address && res.data.address.detail ? res.data.address.detail : '',
          district: res.data.address && res.data.address.district ? res.data.address.district : '',
          postalCode:
            res.data.address && res.data.address.postalCode ? res.data.address.postalCode : '',
          name: res.data.name ? res.data.name : '',
          types: res.data.explorationTypes ? res.data.explorationTypes.map(elem => elem.name) : '',
          isLoading: false,
        });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  }

  onEdit = e => {
    const entityId = this.props.match.params.entityId;
    const id = this.props.match.params.id;
    this.props.history.push(`/livestock/explorations/${entityId}/edit/${id}`);
  };

  render() {
    const { name, types, address, district, postalCode } = this.state;
    return (
      <Card>
        <CardContent>
          <div className="card-header">
            <Typography variant="headline" className="card-header_title">
              Exploração
            </Typography>
          </div>
          <div className="card-body">
            {name && (
              <div className="card-field col-6">
                <p className="field-info">{name}</p>
                <label className="field-label">Nome</label>
              </div>
            )}
            {types && (
              <div className="card-field col-6">
                <p className="field-info">{getExplorationTypesFromId(types)}</p>
                <label className="field-label">Tipo de exploração</label>
              </div>
            )}
            {address && (
              <div className="card-field col-6">
                <p className="field-info">{address}</p>
                <label className="field-label">Morada</label>
              </div>
            )}
            {district && (
              <div className="card-field col-3">
                <p className="field-info">{district}</p>
                <label className="field-label">Distrito</label>
              </div>
            )}
            {postalCode && (
              <div className="card-field col-2">
                <p className="field-info">{postalCode}</p>
                <label className="field-label">Código Postal</label>
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
            onClick={this.onEdit}
          >
            Editar
          </Button>
        </div>
      </Card>
    );
  }
}

export default ExplorationDetailPage;
