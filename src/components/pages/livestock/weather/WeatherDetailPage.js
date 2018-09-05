import React, { Component, Fragment } from 'react';
import { CircularProgress, Card, CardContent, Typography } from 'material-ui';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import WeatherService from '../../../../services/WeatherService';
import { I18nContext } from '../../../App';
import '../../../livestock/weather/weather.css';

class WeatherDetailPage extends Component {
  state = {
    weatherData: null,
    placeId: null,
    isLoading: null,
    serverError: null,
  };

  componentWillMount() {
    this.setState({ isLoading: true });

    const getWeatherDataResponse = WeatherService.getWeather(this.props.match.params.placeId, true);

    getWeatherDataResponse
      .then(res => {
        this.setState({ weatherData: res.data, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  }

  mapWeatherIcon = icon => {
    return `icon--${icon}`;
  };

  render() {
    const { weatherData, isLoading, serverError } = this.state;

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
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {!isLoading &&
              !serverError &&
              weatherData && (
                <div>
                  <Card className="card-weather-today">
                    <CardContent style={{ display: 'flex', width: '100%' }}>
                      <div className="card-weather-today-detail-temp">
                        <Typography variant="title" color="primary" style={{ marginBottom: 20 }}>
                          {i18n.weather.weather} ({weatherData.dailyWeather[0].lat.substring(0, 8)}, {weatherData.dailyWeather[0].lng.substring(0, 8)}) 
                        </Typography>
                        <div
                          className={`card-weather-today-icon ${this.mapWeatherIcon(
                            weatherData.dailyWeather[0].icon,
                          )}`}
                        />
                        <div>
                          {i18n.weather.temperature}
                          <Typography variant="title">
                            <span style={{ color: 'red' }}>
                              {weatherData.dailyWeather[0].temperatureMax + 'ºC'}
                            </span>
                            {' / '}
                            <span style={{ color: 'blue' }}>
                              {weatherData.dailyWeather[0].temperatureMin + 'ºC'}
                            </span>
                          </Typography>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
                        <div
                          style={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'baseline',
                            alignSelf: 'flex-end',
                          }}
                        >
                          {i18n.weather.date + ': '}
                          <Typography variant="title">
                            {new Date(weatherData.dailyWeather[0].time * 1000).toLocaleDateString(
                              'pt-PT',
                            )}
                          </Typography>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignSelf: 'flex-end',
                          }}
                        >
                          <div style={{ margin: '5px 0' }}>
                            {i18n.weather.humidity}
                            <Typography variant="title">
                              {parseFloat(
                                Math.round(weatherData.dailyWeather[0].humidity * 100 * 100) / 100,
                              ).toFixed(2) + '%'}
                            </Typography>{' '}
                          </div>
                          <div>
                            {i18n.weather.windSpeed}
                            <Typography variant="title">
                              {weatherData.dailyWeather[0].windSpeed + 'km/h'}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="card-weather-nexDays-container">
                    {weatherData.dailyWeather.map((w, index) => {
                      return (
                        index > 0 && (
                          <Card className="card-weather-nextDay" key={index}>
                            <CardContent style={{ display: 'flex', width: '100%' }}>
                              <div
                                style={{ display: 'flex', flexDirection: 'column', width: '60%' }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    marginBottom: 10,
                                  }}
                                >
                                  {i18n.weather.date + ': '}
                                  <Typography variant="title">
                                    {new Date(w.time * 1000).toLocaleDateString('pt-PT')}
                                  </Typography>
                                </div>
                                <div
                                  className={`card-weather-next-days-icon ${this.mapWeatherIcon(
                                    w.icon,
                                  )}`}
                                />
                                <div>
                                  {i18n.weather.temperature}
                                  <Typography variant="title">
                                    <span style={{ color: 'red' }}>{w.temperatureMax + 'ºC'}</span>
                                    {' / '}
                                    <span style={{ color: 'blue' }}>{w.temperatureMin + 'ºC'}</span>
                                  </Typography>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                              >
                                <div style={{ margin: '5px 0' }}>
                                  {i18n.weather.humidity}
                                  <Typography variant="title">
                                    {parseFloat(Math.round(w.humidity * 100 * 100) / 100).toFixed(
                                      2,
                                    ) + '%'}
                                  </Typography>{' '}
                                </div>
                                <div>
                                  {i18n.weather.windSpeed}
                                  <Typography variant="title">{w.windSpeed + 'km/h'}</Typography>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default WeatherDetailPage;
