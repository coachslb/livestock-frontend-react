import React, { Component, Fragment } from 'react';
import { CircularProgress, Button } from 'material-ui';
import PlaceService from '../../../../../services/PlaceService';
import EmptyPlace from '../../../../livestock/place/EmptyPlace';
import ListCardPlace from '../../../../livestock/place/ListCardPlace';

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

    const deleteExplorationPlaceResponse = PlaceService.deletePlace(
      placeId,
      id,
      false,
      true,
    );
    deleteExplorationPlaceResponse
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, places: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  onCreatePlace = (e) => {
    e.preventDefault();
    this.props.history.push(`/livestock/explorations/${this.props.match.params.entityId}/place/${this.props.match.params.id}/create`);
  }

  render() {
    const { id, entityId } = this.props.match.params;
    const { hasData, places, isLoading } = this.state;
    let render = <EmptyPlace explorationId={id} entityId={entityId} />;
    if (hasData && !isLoading)
      render = places.map(place => {
        return (
          <ListCardPlace
            key={place.id}
            data={place}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
          />
        );
      });
    return (
      <Fragment>
        {!isLoading && render}
        {hasData &&
          !isLoading && (
            <Button
              className="placeholder-button-text"
              variant="raised"
              style={{ width: '100%' }}
              color="primary"
              onClick={this.onCreatePlace}
            >
              + Adicionar
            </Button>
          )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default ExplorationPlacePage;
