import React, { Component, Fragment } from 'react';
import { CircularProgress } from 'material-ui';
import EmptyAnimal from '../../../../livestock/animal/EmptyAnimal';
import ListExplorationAnimals from '../../../../../components/livestock/animal/ListExplorationAnimals';
import AnimalService from '../../../../../services/AnimalService';

class ExplorationAnimalPage extends Component {
  constructor() {
    super();
    this.state = {
      serverError: false,
      isLoading: false,
      hasData: false,
      animals: null,
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    console.log(this.props.match.params);
    const { explorationId } = this.props.match.params;

    if (explorationId) {
      const getAnimalList = AnimalService.get(null, explorationId, true);

      getAnimalList
        .then(res => {
          if (res.data.length > 0) {
            this.setState({ hasData: true, isLoading: false, animals: res.data });
          } else this.setState({ hasData: false, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  onCreatePlace = e => {
    e.preventDefault();
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/animal/${
        this.props.match.params.id
      }/create`,
    );
  };

  render() {
    const { explorationId, entityId } = this.props.match.params;
    const { hasData, isLoading, animals } = this.state;
    let render = <EmptyAnimal explorationId={explorationId} entityId={entityId} />;
    if (hasData && !isLoading)
      render = <ListExplorationAnimals
            data={animals}
          />
    return (
      <Fragment>
        {!isLoading && render}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default ExplorationAnimalPage;
