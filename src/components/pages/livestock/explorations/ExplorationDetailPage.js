import React, { Component } from 'react';
import { Typography, Card, CardContent, Button } from 'material-ui';
import ExplorationService from '../../../../services/ExplorationService';
import FixedValuesService from '../../../../services/FixedValuesService';
import { I18nContext } from '../../../App';

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

function getProductionTypesFromId(productionTypes) {
  productionTypes.sort();
  let first = true;
  return productionTypes.map(type => {
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
      number: '',
      addressId: '',
      address: '',
      postalCode: '',
      district: '',
      explorationTypes: [],
      productionTypes: [],
      explorationSystem: '',
      isLoading: false,
      serverError: false,
      errors: null,
      types: [],
      productions: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    let getOneExplorationPromise = ExplorationService.get(this.props.match.params.id, null, true);

    let explorationTypePromise = FixedValuesService.getExplorationTypes(true);
    let productionTypePromise = FixedValuesService.getProductionTypes(true);
    explorationTypePromise
      .then(res => {
        this.setState({ explorationTypes: res.data });
      })
      .catch(err => this.setState({ serverError: true }));
    productionTypePromise
      .then(res => {
        this.setState({ productionTypes: res.data });
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
          number: res.data.number ? res.data.number : '',
          explorationSystem: res.data.explorationSystem && res.data.explorationSystem.name ? res.data.explorationSystem.name : '',
          types: res.data.explorationTypes ? res.data.explorationTypes.map(elem => elem.name) : '',
          productions: res.data.productionTypes ? res.data.productionTypes.map(elem => elem.name) : '',
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
    const { name, number, types, productions, explorationSystem, address, district, postalCode } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Card>
            <CardContent>
              <div className="card-header">
                <Typography variant="headline" className="card-header_title">
                  {i18n.exploration.explorationTitle}
                </Typography>
              </div>
              <div className="card-body">
                {name && (
                  <div className="card-field col-3">
                    <p className="field-info">{name}</p>
                    <label className="field-label">{i18n.exploration.name}</label>
                  </div>
                )}
                {number && (
                  <div className="card-field col-2">
                    <p className="field-info">{number}</p>
                    <label className="field-label">{i18n.exploration.number}</label>
                  </div>
                )}
                {types && (
                  <div className="card-field col-6">
                    <p className="field-info">{getExplorationTypesFromId(types)}</p>
                    <label className="field-label">{i18n.exploration.explorationType}</label>
                  </div>
                )}
                {address && (
                  <div className="card-field col-6">
                    <p className="field-info">{address}</p>
                    <label className="field-label">{i18n.exploration.address}</label>
                  </div>
                )}
                {district && (
                  <div className="card-field col-3">
                    <p className="field-info">{district}</p>
                    <label className="field-label">{i18n.exploration.district}</label>
                  </div>
                )}
                {postalCode && (
                  <div className="card-field col-2">
                    <p className="field-info">{postalCode}</p>
                    <label className="field-label">{i18n.exploration.postalCode}</label>
                  </div>
                )}
                {explorationSystem && (
                  <div className="card-field col-6">
                    <p className="field-info">{explorationSystem}</p>
                    <label className="field-label">{i18n.exploration.explorationSystem}</label>
                  </div>
                )}
                {productions && productions.length > 0 && (
                  <div className="card-field col-6">
                    <p className="field-info">{getProductionTypesFromId(productions)}</p>
                    <label className="field-label">{i18n.exploration.productionType}</label>
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
                {i18n.exploration.button.edit}
              </Button>
            </div>
          </Card>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ExplorationDetailPage;
