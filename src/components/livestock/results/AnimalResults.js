import React, { Component, Fragment } from 'react';
import { CircularProgress, Card, CardContent, Typography, Grid } from 'material-ui';
import { I18nContext } from '../../App';
import { PieChart } from '../../utils/charts/PieChart';
import { randomizeColor } from '../../utils/ColorUtils';

class AnimalResults extends Component {
  state = {
    animalTypeData: null,
    animalSexData: null,
    animalBreedData: null,
    animalStateData: null,
    serverError: null,
  };

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        animalTypeData: {
          datasets: [
            {
              backgroundColor: this.props.data.type.map(item => randomizeColor()),
              data: this.props.data.type.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.type.map(item => item.name),
        },
        animalSexData: {
          datasets: [
            {
              backgroundColor: this.props.data.sex.map(item => randomizeColor()),
              data: this.props.data.sex.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.sex.map(item => item.name),
        },
        animalBreedData: {
          datasets: [
            {
              backgroundColor: this.props.data.breed.map(item => randomizeColor()),
              data: this.props.data.breed.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.breed.map(item => item.name),
        },
        animalStateData: {
          datasets: [
            {
              backgroundColor: this.props.data.state.map(item => randomizeColor()),
              data: this.props.data.state.map(item => item.animalCount),
            },
          ],
          labels: this.props.data.state.map(item => item.name),
        },
      });
    }
  }

  render() {
    const { animalTypeData, animalSexData, animalBreedData, animalStateData } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {animalTypeData && animalSexData && animalBreedData && animalStateData ? (
              <Card style={{ marginTop: 10 }}>
                <CardContent>
                  <div className="card-header">
                    <Typography variant="headline" className="card-header_title" color="primary">
                      {i18n.results.animals}
                    </Typography>
                  </div>
                  <Grid className="card-body" container spacing={24}>
                    <Grid item xl={6} md={12}>
                      <Typography variant="title" style={{ marginBottom: 20 }}>
                        {i18n.results.animalData.type}
                      </Typography>
                      <PieChart
                        data={animalTypeData}
                        legend={{ position: 'right', labels: { fontSize: 14 } }}
                      />
                    </Grid>
                    <Grid item xl={6} md={12}>
                      <Typography variant="title" style={{ marginBottom: 20 }}>
                        {i18n.results.animalData.sex}
                      </Typography>
                      <PieChart
                        data={animalSexData}
                        legend={{ position: 'right', labels: { fontSize: 14 } }}
                      />
                    </Grid>
                    <Grid item xl={6} md={12}>
                      <Typography variant="title" style={{ marginBottom: 20 }}>
                        {i18n.results.animalData.breed}
                      </Typography>
                      <PieChart
                        data={animalBreedData}
                        legend={{ position: 'right', labels: { fontSize: 14 } }}
                      />
                    </Grid>
                    <Grid item xl={6} md={12}>
                      <Typography variant="title" style={{ marginBottom: 20 }}>
                        {i18n.results.animalData.state}
                      </Typography>
                      <PieChart
                        data={animalStateData}
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

export default AnimalResults;
