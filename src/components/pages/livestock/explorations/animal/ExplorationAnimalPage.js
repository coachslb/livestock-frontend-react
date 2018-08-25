import React, { Component, Fragment } from 'react';
import {
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from 'material-ui';
import EmptyAnimal from '../../../../livestock/animal/EmptyAnimal';
import ListExplorationAnimals from '../../../../../components/livestock/animal/ListExplorationAnimals';
import AnimalService from '../../../../../services/AnimalService';
import { I18nContext } from '../../../../App';

class ExplorationAnimalPage extends Component {
  constructor() {
    super();
    this.state = {
      serverError: false,
      isLoading: false,
      hasData: false,
      animals: null,
      query: '',
      columnToQuery: 'name',
    };
  }
  componentDidMount() {
    this.setState({ isLoading: true });
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

  onCreateAnimal = e => {
    e.preventDefault();
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/animal/${
        this.props.match.params.explorationId
      }/create`,
    );
  };

  handleRemove = i => {
    const deleteAnimal = AnimalService.deleteAnimal(
      i,
      this.props.match.params.explorationId,
      false,
      true,
    );

    deleteAnimal
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ hasData: true, isLoading: false, animals: res.data });
        } else this.setState({ hasData: false, isLoading: false });
      })
      .catch(err => this.setState({ serverError: true, isLoading: false }));
  };

  handleEdit = i => {
    this.props.history.push(
      `/livestock/explorations/${this.props.match.params.entityId}/animal/${
        this.props.match.params.explorationId
      }/edit/${i}`,
    );
  };

  handleChangeQuery = value => this.setState({ query: value });

  render() {
    const { explorationId, entityId } = this.props.match.params;
    const { hasData, isLoading, animals, query, columnToQuery } = this.state;

    let render = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <EmptyAnimal explorationId={explorationId} entityId={entityId} i18n={i18n.exploration} />
        )}
      </I18nContext.Consumer>
    );
    if (hasData && !isLoading)
      render = (
        <I18nContext.Consumer>
          {({ i18n }) => (
            <Fragment>
              <div style={{ width: '100%', margin: '20px 0' }}>
                <FormControl style={{ width: '200px', marginRight: '20px' }}>
                  <InputLabel>{i18n.general.search}</InputLabel>
                  <Input
                    name="query"
                    value={query}
                    onChange={e => this.setState({ query: e.target.value.toLowerCase() })}
                  />
                </FormControl>
                <FormControl style={{ width: '200px' }}>
                  <InputLabel>{i18n.general.column}</InputLabel>
                  <Select
                    value={columnToQuery}
                    onChange={event => {
                      this.setState({ columnToQuery: event.target.value });
                    }}
                  >
                    <MenuItem value="number">{i18n.exploration.animals.number}</MenuItem>
                    <MenuItem value="chipNumber">{i18n.exploration.animals.chipNumber}</MenuItem>
                    <MenuItem value="birthDate">{i18n.exploration.animals.birthDate}</MenuItem>
                    <MenuItem value="explorationType">
                      {i18n.exploration.animals.animalType}
                    </MenuItem>
                    <MenuItem value="sex">
                      {i18n.exploration.animals.sex}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <ListExplorationAnimals
                handleRemove={this.handleRemove}
                onEdit={this.handleEdit}
                data={
                  query
                    ? animals.filter(
                        item =>
                          columnToQuery !== 'explorationType' && columnToQuery !== 'sex'
                            ? item[columnToQuery] &&
                              item[columnToQuery].toLowerCase().includes(query)
                            : item[columnToQuery].name &&
                              item[columnToQuery].name.toLowerCase().includes(query),
                      )
                    : animals
                }
                i18n={i18n}
                header={[
                  {
                    name: i18n.exploration.animals.number,
                    prop: 'number',
                  },
                  {
                    name: i18n.exploration.animals.chipNumber,
                    prop: 'chipNumber',
                  },
                  {
                    name: i18n.exploration.animals.sex,
                    prop: 'sex',
                  },
                  {
                    name: i18n.exploration.animals.birthDate,
                    prop: 'birthDate',
                  },
                  {
                    name: i18n.exploration.animals.animalType,
                    prop: 'explorationType',
                  },
                ]}
              />
            </Fragment>
          )}
        </I18nContext.Consumer>
      );
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
                  onClick={this.onCreateAnimal}
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

export default ExplorationAnimalPage;
