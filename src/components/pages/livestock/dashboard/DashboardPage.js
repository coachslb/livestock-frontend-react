import React, { Component, Fragment } from 'react';
import WelcomeCard from '../../../livestock/dashboard/WelcomeCard';
import FreeTrialCard from '../../../livestock/dashboard/FreeTrialCard';
import FirstUseSection from '../../../livestock/dashboard/FirstUseSection';
import StatisticsSection from '../../../livestock/dashboard/StatisticsSection';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { CircularProgress } from 'material-ui';
import DashboardService from '../../../../services/DashboardService';

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      serverError: null,
      isLoading: null,
    };
  }
  componentWillMount() {
    const entityId = localStorage.getItem('entityId');
    this.setState({ isLoading: true, entityId });

    if (entityId) {
      const getDashboardResponse = DashboardService.getDashboard(entityId, true);

      getDashboardResponse
        .then(res => {
          this.setState({ ...res.data, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  }

  render() {
    const { isLoading, serverError, freeTrial, license, firstUse, agricolaEntity, management, entityId } = this.state;
    console.log(this.state);
    const renderFirstUse = (
      <Fragment>
        <WelcomeCard />
        <FirstUseSection 
            hasExploration={agricolaEntity && agricolaEntity.explorations > 0}
            entityId={entityId}
        />
      </Fragment>
    );

    const renderStatistics = (
      <Fragment>
        <StatisticsSection agricolaEntity={agricolaEntity} management={management} entityId={entityId}/>
      </Fragment>
    );
    return (
      <Fragment>
        {!isLoading && (
          <Fragment>
            {freeTrial && license.free && <FreeTrialCard />}
            {firstUse ? renderFirstUse : renderStatistics}
            {serverError && (
              <ErrorDialog
                title="Server Error"
                text="There are some server problem"
                onDialogClose={this.onDialogClose}
              />
            )}
          </Fragment>
        )}
        {isLoading && (
          <CircularProgress
            style={{ height: '80px', width: '80px', top: '50%', left: '50%', position: 'absolute' }}
          />
        )}
      </Fragment>
    );
  }
}

export default DashboardPage;
