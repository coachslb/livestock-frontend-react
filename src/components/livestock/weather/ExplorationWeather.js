import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent } from 'material-ui';
import './weather.css';

class ExplorationWeather extends Component {
  state = {
    hidden: [],
  };
  toggle = () => {};
  render() {
    return (
      <Fragment>
        {this.props.explorationWeather.map((w, index) => {
          const hidden = this.state.hidden.includes(index);
          return (
            <div key={index} style={{ marginBottom: 20 }}>
              <div
                className="weather-exploration-header"
                onClick={() =>
                  this.setState(state => ({
                    hidden: state.hidden.includes(index)
                      ? state.hidden.filter(i => i !== index)
                      : [...state.hidden, index],
                  }))
                }
              >
                <Typography className="weather-exploration-header--name" variant="title">
                  {w.explorationName}
                </Typography>
                <i className="material-icons">{hidden ? 'visibility_off' : 'visibility'}</i>
              </div>
              {!hidden &&
                w.places.map((p, index) => {
                  return (
                    <Link
                      key={index}
                      to={`/livestock/weather/${localStorage.getItem('entityId')}/detail/${
                        p.placeId
                      }`}
                    >
                      <div className="weather-exploration-card">
                        <Card style={{ marginTop: 20, width: '100%' }}>
                          <CardContent style={{ display: 'flex' }}>
                            <div className="weather-exploration-location">
                              <Typography variant="title" style={{ marginBottom: 10 }}>
                                {p.placeName}
                              </Typography>
                              <Typography variant="body1" color="textSecondary">
                                {p.lat.substring(0, 8) + ', ' + p.lng.substring(0, 8)}
                              </Typography>
                            </div>
                            <div className="weather-exploration-conditions">
                              <div
                                className={`weather-exploration-icon icon--${
                                  p.dailyWeather[0].icon
                                }`}
                              />
                              <div>
                                <Typography variant="body1">{p.dailyWeather[0].summary}</Typography>
                                <Typography variant="body1">
                                  {p.dailyWeather[0].temperatureMax +
                                    'ºC / ' +
                                    p.dailyWeather[0].temperatureMin +
                                    'ºC'}
                                </Typography>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export default ExplorationWeather;
