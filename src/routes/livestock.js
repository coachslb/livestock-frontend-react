import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import DashboardPage from '../components/pages/livestock/dashboard/DashboardPage';
import Layout from '../components/UI/Layout/Layout';
import ExplorationPage from '../components/pages/livestock/explorations/ExplorationPage';
import ManagementPage from '../components/pages/livestock/management/ManagementPage';
import ResultsPage from '../components/pages/livestock/results/ResultsPage';
import InventoryPage from '../components/pages/livestock/inventory/InventoryPage';
import UsersPage from '../components/pages/livestock/users/UsersPage';
import CreateOrUpdateUserPage from '../components/pages/livestock/users/CreateOrUpdateUserPage';
import UserDetailPage from '../components/pages/livestock/users/UserDetailPage';
import SupportPage from '../components/pages/livestock/support/SupportPage';
import Logout from '../components/accounts/logout/Logout';
import ExplorationDetailPage from '../components/pages/livestock/explorations/ExplorationDetailPage';
import CreateExplorationPage from '../components/pages/livestock/explorations/CreateExplorationPage';
import EntityDetailPage from '../components/pages/livestock/entities/EntityDetailPage';
import EditExplorationPage from '../components/pages/livestock/explorations/EditExplorationPage';
import ExplorationPlacePage from '../components/pages/livestock/explorations/place/ExplorationPlacePage';
import CreateorUpdateExplorationPlacePage from '../components/pages/livestock/explorations/place/CreateorUpdateExplorationPlacePage';
import ExplorationAnimalPage from '../components/pages/livestock/explorations/animal/ExplorationAnimalPage';
import CreateOrUpdateExplorationAnimalPage from '../components/pages/livestock/explorations/animal/CreateOrUpdateExplorationAnimalPage';
import CreateOrUpdateExplorationGroupPage from '../components/pages/livestock/explorations/group/CreateOrUpdateExplorationGroupPage';
import ExplorationGroupPage from '../components/pages/livestock/explorations/group/ExplorationGroupPage';
import SelectManagementTypePage from '../components/pages/livestock/management/SelectManagementTypePage';
import CreateorUpdateChildBirthManagementPage from '../components/pages/livestock/management/CreateorUpdateChildBirthManagementPage';
import CreateorUpdateBirthRegistrationManagementPage from '../components/pages/livestock/management/CreateorUpdateBirthRegistrationManagementPage';
import CreateorUpdateWeighingManagementPage from '../components/pages/livestock/management/CreateorUpdateWeighingManagementPage';
import CreateorUpdateSanitaryManagementPage from '../components/pages/livestock/management/CreateorUpdateSanitaryManagementPage';
import CreateorUpdateFeedManagementPage from '../components/pages/livestock/management/CreateorUpdateFeedManagementPage';
import CreateorUpdateCoberturaManagementPage from '../components/pages/livestock/management/CreateorUpdateCoberturaManagementPage';
import CreateorUpdateTransferManagementPage from '../components/pages/livestock/management/CreateorUpdateTransferManagementPage';
import CreateorUpdateDeathManagementPage from '../components/pages/livestock/management/CreateorUpdateDeathManagementPage';
import CreateorUpdateSellorPurchaseManagementPage from '../components/pages/livestock/management/CreateorUpdateSellorPurchaseManagementPage';
import CreateorUpdateChipManagementPage from '../components/pages/livestock/management/CreateorUpdateChipManagementPage';
import TaskPage from '../components/pages/livestock/task/TaskPage';
import UserChangeEmailPage from '../components/pages/livestock/users/preferences/UserChangeEmailPage';
import UserChangePasswordPage from '../components/pages/livestock/users/preferences/UserChangePasswordPage';
import UserChangeLanguagePage from '../components/pages/livestock/users/preferences/UserChangeLanguagePage';
import LicensePage from '../components/pages/livestock/license/LicensePage';
import WeatherResumePage from '../components/pages/livestock/weather/WeatherResumePage';
import WeatherDetailPage from '../components/pages/livestock/weather/WeatherDetailPage';

class LivestockPage extends Component {
  render() {
    if (!localStorage.getItem('entityId')) return <Redirect to="/login" />;

    return (
      <Layout>
        <Switch>
          <Route path="/livestock/entity/:id" component={EntityDetailPage} />
          <Route path="/livestock/dashboard" component={DashboardPage} />
          <Route
            path="/livestock/explorations/:entityId/detail/:id"
            component={ExplorationDetailPage}
          />
          <Route
            path="/livestock/explorations/:entityId/place/:explorationId/create"
            component={CreateorUpdateExplorationPlacePage}
          />
          <Route
            path="/livestock/explorations/:entityId/place/:explorationId/edit/:id"
            component={CreateorUpdateExplorationPlacePage}
          />
          <Route
            path="/livestock/explorations/:entityId/place/:id"
            component={ExplorationPlacePage}
          />
          <Route
            path="/livestock/explorations/:entityId/animal/:explorationId/create"
            component={CreateOrUpdateExplorationAnimalPage}
          />
          <Route
            path="/livestock/explorations/:entityId/animal/:explorationId/edit/:id"
            component={CreateOrUpdateExplorationAnimalPage}
          />
          <Route
            path="/livestock/explorations/:entityId/animal/:explorationId"
            component={ExplorationAnimalPage}
          />
          <Route
            path="/livestock/explorations/:entityId/group/:explorationId/create"
            component={CreateOrUpdateExplorationGroupPage}
          />
          <Route
            path="/livestock/explorations/:entityId/group/:explorationId/edit/:id"
            component={CreateOrUpdateExplorationGroupPage}
          />
          <Route
            path="/livestock/explorations/:entityId/group/:explorationId"
            component={ExplorationGroupPage}
          />
          <Route
            path="/livestock/explorations/:entityId/edit/:id"
            component={EditExplorationPage}
          />
          <Route path="/livestock/explorations/:id/create" component={CreateExplorationPage} />
          <Route path="/livestock/explorations/:id" component={ExplorationPage} />
          <Route
            path="/livestock/management/:entityId/edit/childBirth/:id"
            component={CreateorUpdateChildBirthManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/childBirth"
            component={CreateorUpdateChildBirthManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/birthRegistration/:id"
            component={CreateorUpdateBirthRegistrationManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/birthRegistration"
            component={CreateorUpdateBirthRegistrationManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/weighing/:id"
            component={CreateorUpdateWeighingManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/weighing"
            component={CreateorUpdateWeighingManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/feed/:id"
            component={CreateorUpdateFeedManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/feed"
            component={CreateorUpdateFeedManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/sanitary/:id"
            component={CreateorUpdateSanitaryManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/sanitary"
            component={CreateorUpdateSanitaryManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/sex/:id"
            component={CreateorUpdateCoberturaManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/sex"
            component={CreateorUpdateCoberturaManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/death/:id"
            component={CreateorUpdateDeathManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/death"
            component={CreateorUpdateDeathManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/transfer/:id"
            component={CreateorUpdateTransferManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/transfer"
            component={CreateorUpdateTransferManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/sellorPurchase/:id"
            component={CreateorUpdateSellorPurchaseManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/sellorPurchase"
            component={CreateorUpdateSellorPurchaseManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/edit/chip/:id"
            component={CreateorUpdateChipManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create/chip"
            component={CreateorUpdateChipManagementPage}
          />
          <Route
            path="/livestock/management/:entityId/create"
            component={SelectManagementTypePage}
          />
          <Route path="/livestock/management/:entityId" component={ManagementPage} />
          <Route path="/livestock/management" component={ManagementPage} />
          <Route path="/livestock/inventory" component={InventoryPage} />
          <Route path="/livestock/results" component={ResultsPage} />
          <Route
            path="/livestock/weather/:entityId/detail/:placeId"
            component={WeatherDetailPage}
          />
          <Route path="/livestock/weather" component={WeatherResumePage} />
          <Route path="/livestock/users/:entityId/detail/:id" component={UserDetailPage} />
          <Route
            path="/livestock/users/:entityId/changeEmail/:id"
            component={UserChangeEmailPage}
          />
          <Route
            path="/livestock/users/:entityId/changePassword/:id"
            component={UserChangePasswordPage}
          />
          <Route
            path="/livestock/users/:entityId/changeLanguage/:id"
            component={UserChangeLanguagePage}
          />
          <Route path="/livestock/users/:entityId/license/:id" component={LicensePage} />
          <Route path="/livestock/users/:entityId/edit/:id" component={CreateOrUpdateUserPage} />
          <Route path="/livestock/users/:entityId/create" component={CreateOrUpdateUserPage} />
          <Route path="/livestock/users/:id" component={UsersPage} />
          <Route path="/livestock/support" component={SupportPage} />
          <Route path="/livestock/tasks" component={TaskPage} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={DashboardPage} />
        </Switch>
      </Layout>
    );
  }
}

export default LivestockPage;
