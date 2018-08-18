import React, { Component, Fragment } from 'react';
import { CircularProgress } from 'material-ui';
import ExplorationWeather from '../../../livestock/weather/ExplorationWeather';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import WeatherService from '../../../../services/WeatherService';
import { I18nContext } from '../../../App';

class WeatherResumePage extends Component {
  state = {
    weatherResumeList: null,
    isLoading: null,
    serverError: null,
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    const entityId = localStorage.getItem('entityId');

    const getWeatherListResponse = WeatherService.getWeatherResume(entityId, true);

    getWeatherListResponse
      .then(res => {
        this.setState({ weatherResumeList: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  }

  render() {
    const { weatherResumeList, isLoading, serverError } = this.state;

    let render = <div>Hello weather resume page</div>;
    if (weatherResumeList) {
      return <ExplorationWeather explorationWeather={weatherResumeList} />;
    }

    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
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
            {!isLoading && !serverError && render}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default WeatherResumePage;
