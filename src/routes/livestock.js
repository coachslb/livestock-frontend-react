import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardPage from '../components/pages/livestock/dashboard/DashboardPage';
import Layout from '../components/UI/Layout/Layout';
import ExplorationPage from '../components/pages/livestock/explorations/ExplorationPage';
import ManagementPage from '../components/pages/livestock/management/ManagementPage';
import ResultsPage from '../components/pages/livestock/results/ResultsPage';
import InventoryPage from '../components/pages/livestock/inventory/InventoryPage';
import UsersPage from '../components/pages/livestock/users/UsersPage';
import SupportPage from '../components/pages/livestock/support/SupportPage';
import Logout from '../components/accounts/logout/Logout';
import ExplorationDetailPage from '../components/pages/livestock/explorations/ExplorationDetailPage';
import CreateExplorationPage from '../components/pages/livestock/explorations/CreateExplorationPage';
import EntityDetailPage from '../components/pages/livestock/entities/EntityDetailPage';
import EditExplorationPage from '../components/pages/livestock/explorations/EditExplorationPage';
import ExplorationPlacePage from '../components/pages/livestock/explorations/place/ExplorationPlacePage';
import CreateorUpdateExplorationPlacePage from '../components/pages/livestock/explorations/place/CreateorUpdateExplorationPlacePage';
import ExplorationAnimalPage from '../components/pages/livestock/explorations/animal/ExplorationAnimalPage';
import LoginUserDetailPage from '../components/pages/livestock/loginUser/LoginUserDetailPage';
import CreateOrUpdateExplorationAnimalPage from '../components/pages/livestock/explorations/animal/CreateOrUpdateExplorationAnimalPage';
import CreateOrUpdateExplorationGroupPage from '../components/pages/livestock/explorations/group/CreateOrUpdateExplorationGroupPage'
import ExplorationGroupPage from '../components/pages/livestock/explorations/group/ExplorationGroupPage';

class LivestockPage extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/livestock/entity/:id" component={EntityDetailPage} />
            <Route path="/livestock/user/:id" component={LoginUserDetailPage} />
            <Route path="/livestock/dashboard" component={DashboardPage} />
            <Route path="/livestock/explorations/:entityId/detail/:id" component={ExplorationDetailPage}/>
            <Route path="/livestock/explorations/:entityId/place/:explorationId/create" component={CreateorUpdateExplorationPlacePage}/> 
            <Route path="/livestock/explorations/:entityId/place/:explorationId/edit/:id" component={CreateorUpdateExplorationPlacePage}/> 
            <Route path="/livestock/explorations/:entityId/place/:id" component={ExplorationPlacePage}/> 
            <Route path="/livestock/explorations/:entityId/animal/:explorationId/create" component={CreateOrUpdateExplorationAnimalPage}/> 
            <Route path="/livestock/explorations/:entityId/animal/:explorationId/edit/:id" component={CreateOrUpdateExplorationAnimalPage}/>
            <Route path="/livestock/explorations/:entityId/animal/:explorationId" component={ExplorationAnimalPage}/>
            <Route path="/livestock/explorations/:entityId/group/:explorationId/create" component={CreateOrUpdateExplorationGroupPage}/> 
            <Route path="/livestock/explorations/:entityId/group/:explorationId/edit/:id" component={CreateOrUpdateExplorationGroupPage}/>
            <Route path="/livestock/explorations/:entityId/group/:explorationId" component={ExplorationGroupPage}/> 
            <Route path="/livestock/explorations/:entityId/edit/:id" component={EditExplorationPage}/> 
            <Route path="/livestock/explorations/:id/create" component={CreateExplorationPage}/>
            <Route path="/livestock/explorations/:id" component={ExplorationPage}/>
            <Route path="/livestock/management" component={ManagementPage} />
            <Route path="/livestock/inventory" component={InventoryPage} />
            <Route path="/livestock/results" component={ResultsPage} />
            <Route path="/livestock/users" component={UsersPage} />
            <Route path="/livestock/support" component={SupportPage} />
            <Route path="/livestock" component={DashboardPage} />
            <Route path="/logout" component={Logout} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default LivestockPage;
