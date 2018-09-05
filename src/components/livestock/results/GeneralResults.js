import React, { Component, Fragment } from 'react';
import { CircularProgress, Card, CardContent, Typography, Grid } from 'material-ui';
import { I18nContext } from '../../App';
import { DoughnutChart } from '../../utils/charts/DoughnutChart';
import { randomizeColor } from '../../utils/ColorUtils';

class GeneralResults extends Component {
  state = {
    placesData: null,
    groupsData: null,
    serverError: null,
  };

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        placesData: {
          datasets: [
            {
              backgroundColor: this.props.data.places.map(item => randomizeColor()),
              data: this.props.data.places.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.places.map(item => item.placeName),
        },
        groupsData: {
          datasets: [
            {
              backgroundColor: this.props.data.groups.map(item => randomizeColor()),
              data: this.props.data.groups.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.groups.map(item => item.groupName),
        },
      });
    }
  }

  render() {
    const { placesData, groupsData } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {placesData && groupsData ? (
              <Card style={{ marginTop: 10 }}>
                <CardContent>
                  <div className="card-header">
                    <Typography variant="headline" className="card-header_title" color="primary">
                      {i18n.results.general}
                    </Typography>
                  </div>
                  <Grid className="card-body" container spacing={24}>
                    <Grid item xl={4} md={12}>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'baseline', fontSize: 'x-large'}}>
                        <p>{i18n.results.totalPlaces}:<strong>{this.props.totalPlaces}</strong></p>
                        <p>{i18n.results.totalGroups}:<strong>{this.props.totalGroups}</strong></p>
                        <p>{i18n.results.totalAnimals}:<strong>{this.props.totalAnimals}</strong></p>
                      </div>
                    </Grid>
                    <Grid item xl={4} md={12}>
                      <Typography variant="title" style={{marginBottom: 20}}>{i18n.results.places}</Typography>
                      <DoughnutChart
                        data={placesData}
                        legend={{ position: 'right', labels: { fontSize: 14 } }}
                      />
                    </Grid>
                    <Grid item xl={4} md={12}>
                      <Typography variant="title" style={{marginBottom: 20}}>{i18n.results.groups}</Typography>
                      <DoughnutChart
                        data={groupsData}
                        legend={{ position: 'right', labels: { fontSize: 14 } }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : (
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

export default GeneralResults;
