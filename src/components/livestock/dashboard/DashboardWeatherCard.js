import React from 'react';
import { Card, Typography, Grid } from 'material-ui';

const DashboardWeatherCard = props => {
  console.log(props);
  return (
    <Card style={{ height: '50%', padding: 10 }}>
      <Typography variant="title" color="primary" style={{ marginBottom: 10 }}>
        {props.i18n.weatherTitle} ({props.weather.lat.substring(0, 8)},{' '}
        {props.weather.lng.substring(0, 8)})
      </Typography>
      <Grid container spacing={16} style={{ display: 'flex' }}>
        <Grid item md={4}>
          <Card style={{ padding: 8, height: '100%' }}>
            <Typography variant="title" style={{ marginBottom: 10 }}>
              {props.i18n.today} {props.weather.today.date}
            </Typography>
            <div
              style={{ margin: 'auto', width: 120, height: 120 }}
              className={`weather-exploration-dashboard-icon icon--${props.weather.today.icon}`}
            />
            <div style={{ textAlign: 'center' }}>
              <div>
                {props.weather.today.desc}
                <p>
                  {props.weather.today.maxTemp}
                  ºC/
                  {props.weather.today.minTemp}
                  ºC
                </p>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card style={{ padding: 8, height: '100%' }}>
            <Typography variant="title" style={{ marginBottom: 10 }}>
              {props.i18n.tomorrow} {props.weather.tomorrow.date}
            </Typography>
            <div
              style={{ margin: 'auto', width: 120, height: 120 }}
              className={`weather-exploration-dashboard-icon icon--${props.weather.tomorrow.icon}`}
            />
            <div style={{ textAlign: 'center' }}>
              <div>
                {props.weather.tomorrow.desc}
                <p>
                  {props.weather.tomorrow.maxTemp}
                  ºC/
                  {props.weather.tomorrow.minTemp}
                  ºC
                </p>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card style={{ padding: 8, height: '100%' }}>
            <Typography variant="title" style={{ marginBottom: 10 }}>
              {props.i18n.after} {props.weather.after.date}
            </Typography>
            <div
              style={{ margin: 'auto', width: 120, height: 120 }}
              className={`weather-exploration-dashboard-icon icon--${props.weather.after.icon}`}
            />
            <div style={{ textAlign: 'center' }}>
              <div>
                {props.weather.after.desc}
                <p>
                  {props.weather.after.maxTemp}
                  ºC/
                  {props.weather.after.minTemp}
                  ºC
                </p>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
      <Card />
    </Card>
  );
};

export default DashboardWeatherCard;
