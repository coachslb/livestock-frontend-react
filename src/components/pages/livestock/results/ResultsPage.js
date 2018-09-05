import React, { Component, Fragment } from 'react';
import {
  Card,
  CardContent,
  InputLabel,
  Typography,
  CircularProgress,
  Select,
  FormControl,
  MenuItem,
  Input,
} from 'material-ui';
import GeneralResults from '../../../livestock/results/GeneralResults';
import AnimalResults from '../../../livestock/results/AnimalResults';
import ManagementResults from '../../../livestock/results/ManagementResults';
import ProductionResults from '../../../livestock/results/ProductionResults';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../App';
import ExplorationService from '../../../../services/ExplorationService';
import ResultsService from '../../../../services/ResultsService';

const MILLISECONDS_IN_YEAR = 31556926000;

class ResultsPage extends Component {
  state = {
    exploration: '',
    explorationList: null,
    generalData: null,
    animalData: null,
    managementData: null,
    productionData: null,
    serverError: null,
    isLoading: null,
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    const explorationListResponse = ExplorationService.get(
      null,
      localStorage.getItem('entityId'),
      true,
    );

    explorationListResponse
      .then(res => {
        this.setState({
          explorationList: res.data,
          isLoading: false,
          exploration: res.data.length === 1 ? res.data[0].id : '',
          explorationName: res.data.length === 1 ? res.data[0].name : '',
        });

        if (res.data.length === 1) {
          //do request for exploration results
          this.setState({
            isLoading: true,
          });

          const todayDate = new Date().getTime();
          const todayMinusYear = new Date().getTime() - MILLISECONDS_IN_YEAR;

          const generalResultsPromise = ResultsService.getGeneralResults(res.data[0].id, true);
          const animalResultsPromise = ResultsService.getAnimalResults(res.data[0].id, true);

          const managementResultsPromise = ResultsService.getManagementResults(
            res.data[0].id,
            13,
            todayMinusYear,
            todayDate,
            true,
          );

          const productionResultsPromise = ResultsService.getProductionResults(
            res.data[0].id,
            'Todos',
            todayMinusYear,
            todayDate,
            true,
          );

          productionResultsPromise.then(res => {
            this.setState({
              productionData: res.data,
            });
          });

          managementResultsPromise.then(res => {
            this.setState(prevState => ({
              managementData: res.data,
            }));
          });

          generalResultsPromise.then(res => {
            this.setState({
              isLoading: false,
              generalData: res.data,
            });
          });
          animalResultsPromise.then(res => {
            this.setState({
              isLoading: false,
              animalData: res.data,
            });
          });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  }

  handleExplorationChange = e => {
    this.setState({
      exploration: e.target.value,
      isLoading: true,
      managementData: null,
      productionData: null,
      generalData: null,
      animalData: null,
    });

    const todayDate = new Date().getTime();
    const todayMinusYear = new Date().getTime() - MILLISECONDS_IN_YEAR;

    //get general and animal results data
    const generalResultsPromise = ResultsService.getGeneralResults(e.target.value, true);
    const animalResultsPromise = ResultsService.getAnimalResults(e.target.value, true);

    const managementResultsPromise = ResultsService.getManagementResults(
      e.target.value,
      13,
      todayMinusYear,
      todayDate,
      true,
    );

    const productionResultsPromise = ResultsService.getProductionResults(
      e.target.value,
      'Todos',
      todayMinusYear,
      todayDate,
      true,
    );

    managementResultsPromise.then(res => {
      this.setState({
        managementData: res.data,
      });
    });

    productionResultsPromise.then(res => {
      this.setState({
        productionData: res.data,
      });
    });

    generalResultsPromise.then(res => {
      this.setState({
        isLoading: false,
        generalData: res.data,
      });
    });

    animalResultsPromise.then(res => {
      this.setState({
        isLoading: false,
        animalData: res.data,
      });
    });
  };

  render() {
    const {
      serverError,
      isLoading,
      exploration,
      explorationList,
      explorationName,
      generalData,
      animalData,
      managementData,
      productionData,
    } = this.state;

    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
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
            {!isLoading && (
              <Fragment>
                <Card>
                  <CardContent>
                    <div className="card-header">
                      <Typography variant="headline" className="card-header_title" color="primary">
                        {i18n.results.title}
                      </Typography>
                      {explorationList &&
                        explorationList.length > 1 && (
                          <FormControl
                            style={{
                              width: '45%',
                              margin: '10px',
                            }}
                          >
                            <InputLabel>{i18n.management.exploration}</InputLabel>
                            <Select
                              name="exploration"
                              value={exploration}
                              onChange={this.handleExplorationChange}
                            >
                              {explorationList.map(ex => {
                                return (
                                  <MenuItem key={ex.id} value={ex.id}>
                                    {ex.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        )}
                      {explorationList &&
                        explorationList.length === 1 && (
                          <FormControl
                            style={{
                              width: '45%',
                              margin: '10px',
                            }}
                          >
                            <InputLabel>{i18n.management.exploration}</InputLabel>
                            <Input name="exploration" value={explorationName} disabled />
                          </FormControl>
                        )}
                    </div>
                  </CardContent>
                </Card>
                {exploration && (
                  <Fragment>
                    {generalData && (
                      <GeneralResults
                        data={generalData}
                        totalAnimals={generalData.totalAnimals}
                        totalPlaces={generalData.totalPlaces}
                        totalGroups={generalData.totalGroups}
                      />
                    )}
                    {animalData && <AnimalResults data={animalData} />}
                    {managementData && (
                      <ManagementResults data={managementData} exploration={exploration} />
                    )}
                    {productionData && (
                      <ProductionResults data={productionData} exploration={exploration} />
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ResultsPage;
