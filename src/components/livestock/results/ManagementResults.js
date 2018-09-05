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
import FixedValuesService from '../../../services/FixedValuesService';
import ResultsService from '../../../services/ResultsService';

const MILLISECONDS_IN_YEAR = 31556926000;

class ManagementResults extends Component {
  state = {
    managementData: null,
    serverError: null,
    managementTypeList: null,
    managementType: 13,
    beginDate: new Date(new Date().getTime() - MILLISECONDS_IN_YEAR).toJSON().slice(0, 10),
    endDate: new Date().toJSON().slice(0, 10),
  };

  getManagementValues = () => {
    const managementResultsPromise = ResultsService.getManagementResults(
      this.props.exploration,
      this.state.managementType,
      new Date(this.state.beginDate).getTime(),
      new Date(this.state.endDate).getTime(),
      true,
    );

    managementResultsPromise.then(res => {
      this.setState({
        managementData: {
          datasets: [
            {
              backgroundColor: "#FFCE56",
              borderColor: "#FFCE56",
              data: res.data.managements,
            },
          ],
          labels: res.data.labels,
        },
      });
    });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value }, this.getManagementValues);
  };

  componentDidMount() {
    const managementTypeListPromise = FixedValuesService.getManagementTypes(true);

    managementTypeListPromise
      .then(res => {
        this.setState({ managementTypeList: res.data });
      })
      .catch(err => console.log(err));

    if (this.props.data) {
      this.setState({
        managementData: {
          datasets: [
            {
              backgroundColor: "#FFCE56",
              borderColor: "#FFCE56",
              data: this.props.data.managements,
            },
          ],
          labels: this.props.data.labels,
        },
      });
    }
  }

  render() {
    const { managementData, managementTypeList, managementType, beginDate, endDate } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {managementData ? (
              <Card style={{ marginTop: 10 }}>
                <CardContent>
                  <Grid container spacing={16} style={{alignItems: 'end'}}>
                    <Grid item md={8}>
                      <Typography variant="headline" className="card-header_title" color="primary">
                        {i18n.results.managementResults}
                      </Typography>
                    </Grid>
                    {managementTypeList && (
                      <Grid item md={2}>
                        <FormControl fullWidth>
                          <InputLabel>{i18n.results.managementType}</InputLabel>
                          <Select
                            name="managementType"
                            value={managementType}
                            onChange={this.handleChange}
                          >
                            {managementTypeList.map(ex => {
                              return (
                                <MenuItem key={ex.id} value={ex.id}>
                                  {ex.name}
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
                        {i18n.results.managements}
                      </Typography>
                      <BarChart
                        height={80}
                        data={managementData}
                        legend={{ position: 'right', labels: { fontSize: 14 }, display: false }}
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

export default ManagementResults;
