import React, { Component, Fragment } from 'react';
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from 'material-ui';
import { I18nContext } from '../../App';
import { BarChart } from '../../utils/charts/BarChart';
import ResultsService from '../../../services/ResultsService';
import AnimalService from '../../../services/AnimalService';

const MILLISECONDS_IN_YEAR = 31556926000;

class ProductionResults extends Component {
  state = {
    productionData: null,
    serverError: null,
    animalList: null,
    animal: 'Todos',
    beginDate: new Date(new Date().getTime() - MILLISECONDS_IN_YEAR).toJSON().slice(0, 10),
    endDate: new Date().toJSON().slice(0, 10),
  };

  getProductionValues = () => {
    const productionResultsPromise = ResultsService.getProductionResults(
      this.props.exploration,
      this.state.animal,
      new Date(this.state.beginDate).getTime(),
      new Date(this.state.endDate).getTime(),
      true,
    );

    productionResultsPromise.then(res => {
      this.setState({
        productionData: {
          datasets: [
            {
              backgroundColor: '#EC932F',
              borderColor: '#EC932F',
              pointBackgroundColor: '#EC932F',
              pointBorderColor: '#EC932F',
              data: res.data.dailyAverage,
              type: 'line',
              label: 'Média de produção diária',
              fill: false,
            },
            {
              backgroundColor: "#71B37C",
              borderColor: "#71B37C",
              data: res.data.productions,
              type: 'bar',
              label: 'Produção total',
            },
          ],
          labels: res.data.labels,
        },
      });
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value }, this.getProductionValues);
  };

  componentDidMount() {
    const animalListPromise = AnimalService.get(null, this.props.exploration, true);

    animalListPromise
      .then(res => {
        this.setState({ animalList: [{ id: 0, number: 'Todos' }, ...res.data] });
      })
      .catch(err => console.log(err));

    if (this.props.data) {
      this.setState({
        productionData: {
          datasets: [
            {
              backgroundColor: '#EC932F',
              borderColor: '#EC932F',
              pointBackgroundColor: '#EC932F',
              pointBorderColor: '#EC932F',
              data: this.props.data.dailyAverage,
              type: 'line',
              label: 'Média de produção diária',
              fill: false,
            },
            {
              backgroundColor: "#71B37C",
              borderColor: "#71B37C",
              data: this.props.data.productions,
              type: 'bar',
              label: 'Produção total',
            },
          ],
          labels: this.props.data.labels,
        },
      });
    }
  }

  render() {
    const { productionData, animalList, animal, beginDate, endDate } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {productionData ? (
              <Card style={{ marginTop: 10 }}>
                <CardContent>
                  <Grid container spacing={16} style={{ alignItems: 'end' }}>
                    <Grid item md={8}>
                      <Typography variant="headline" className="card-header_title" color="primary">
                        {i18n.results.production}
                      </Typography>
                    </Grid>
                    {animalList && (
                      <Grid item md={2}>
                        <FormControl fullWidth>
                          <InputLabel>{i18n.results.animal}</InputLabel>
                          <Select name="animal" value={animal} onChange={this.handleChange}>
                            {animalList.map(ex => {
                              return (
                                <MenuItem key={ex.id} value={ex.number}>
                                  {ex.number}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item md={1}>
                      <FormControl fullWidth>
                        <TextField
                          type="date"
                          label={i18n.results.beginDate}
                          name="beginDate"
                          value={beginDate}
                          required
                          onChange={this.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1}>
                      <FormControl fullWidth>
                        <TextField
                          type="date"
                          label={i18n.results.endDate}
                          name="endDate"
                          value={endDate}
                          required
                          onChange={this.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid className="card-body" container spacing={24}>
                    <Grid item xl={12} md={12}>
                      <Typography variant="title" style={{ marginBottom: 20 }}>
                        {i18n.results.production}
                      </Typography>
                      <BarChart
                        height={80}
                        data={productionData}
                        legend={{ position: 'right', labels: { fontSize: 14 }, display: false }}
                        options={{ line: { fill: false }, tooltips: {mode: "label"}}}
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
                  position: 'absolute',
                }}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default ProductionResults;
