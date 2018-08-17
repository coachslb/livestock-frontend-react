import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import WelcomeCard from '../../../livestock/dashboard/WelcomeCard';
import FreeTrialCard from '../../../livestock/dashboard/FreeTrialCard';
import FirstUseSection from '../../../livestock/dashboard/FirstUseSection';
import StatisticsSection from '../../../livestock/dashboard/StatisticsSection';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { CircularProgress } from 'material-ui';
import DashboardService from '../../../../services/DashboardService';
import { I18nContext } from '../../../App';

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

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const {
      isLoading,
      serverError,
      freeTrial,
      license,
      firstUse,
      agricolaEntity,
      management,
      entityId,
    } = this.state;
    const renderFirstUse = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            <WelcomeCard i18n={i18n} />
            <FirstUseSection
              hasExploration={agricolaEntity && agricolaEntity.explorations > 0}
              entityId={entityId}
              i18n={i18n}
            />
          </Fragment>
        )}
      </I18nContext.Consumer>
    );

    const renderStatistics = (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <StatisticsSection
            agricolaEntity={agricolaEntity}
            management={management}
            entityId={entityId}
            i18n={i18n}
          />
        )}
      </I18nContext.Consumer>
    );

    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {!isLoading && (
              <Fragment>
                {freeTrial &&
                  license.free && (
                    <Link
                      to={`/livestock/users/${localStorage.getItem(
                        'entityId',
                      )}/license/${localStorage.getItem('workerId')}`}
                    >
                      <FreeTrialCard i18n={i18n} />
                    </Link>
                  )}
                {firstUse ? renderFirstUse : renderStatistics}
                {serverError && (
                  <ErrorDialog
                    title={i18n.general.serverErrorTitle}
                    text={i18n.general.serverErrorMessage}
                    onDialogClose={this.onDialogClose}
                  />
                )}
              </Fragment>
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
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default DashboardPage;
