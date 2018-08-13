import React, { Component, Fragment } from 'react';
import { CircularProgress, Button } from 'material-ui';
import PlaceService from '../../../../../services/PlaceService';
import EmptyPlace from '../../../../livestock/place/EmptyPlace';
import ListCardPlace from '../../../../livestock/place/ListCardPlace';
import { I18nContext } from '../../../../App';

class ExplorationPlacePage extends Component {
  constructor() {
    super();
    this.state = {
      serverError: false,
      isLoading: false,
      hasData: false,
      places: null,
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    const { id } = this.props.match.params;

    if (id) {
      const getPlacesList = PlaceService.get(null, id, true);

      getPlacesList
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ hasData: true, isLoading: false, places: res.data });
          } else this.setState({ hasData: false, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onEdit = (e, placeId) => {
    e.preventDefault();
    const { entityId, id } = this.props.match.params;
    this.props.history.push(`/livestock/explorations/${entityId}/place/${id}/edit/${placeId}`);
  };

  onDelete = (e, placeId) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    this.setState({ isLoading: true });

    const deleteExplorationPlaceResponse = PlaceService.deletePlace(placeId, id, false, true);
    deleteExplorationPlaceResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, places: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onCreatePlace = e => {
    e.preventDefault();
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/place/${
        this.props.match.params.id
      }/create`,
    );
  };

  render() {
    const { id, entityId } = this.props.match.params;
    const { hasData, places, isLoading } = this.state;
    let render = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <EmptyPlace explorationId={id} entityId={entityId} i18n={i18n.exploration} />
        )}
      </I18nContext.Consumer>
    );
    if (hasData && !isLoading)
      render = places.map(place => {
        return (
          <I18nContext.Consumer key={place.id}>
            {({ i18n }) => (
              <ListCardPlace
                data={place}
                onEdit={this.onEdit}
                onDelete={this.onDelete}
                i18n={i18n.exploration}
              />
            )}
          </I18nContext.Consumer>
        );
      });
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {hasData &&
              !isLoading && (
                <Button
                  className="placeholder-button-text"
                  variant="raised"
                  style={{ width: '100%', padding: '15px', marginBottom: '20px' }}
                  color="primary"
                  onClick={this.onCreatePlace}
                >
                  + {i18n.exploration.button.add}
                </Button>
              )}
            {!isLoading && render}
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
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ExplorationPlacePage;
