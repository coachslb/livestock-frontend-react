import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardPage from '../components/pages/livestock/dashboard/DashboardPage';

class LivestockPage extends Component {
  render() {
    return (
      <div>
        hello
        <BrowserRouter>
          <Switch>
            <Route path="/dashboard" component={DashboardPage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default LivestockPage;
