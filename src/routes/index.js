import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from '../components/pages/accounts/login/LoginPage';
import RegistrationPage from '../components/pages/accounts/registration/RegistrationPage';
import ForgotPasswordPage from '../components/pages/accounts/forgotPassword/ForgotPasswordPage';
import SelectEntityPage from '../components/pages/livestock/entities/SelectEntityPage';
import CreateEntityPage from '../components/pages/livestock/entities/CreateEntityPage';
import LivestockPage from './livestock';
import Logout from '../components/accounts/logout/Logout';

export default () => {
    return(
    <BrowserRouter>
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/create-entity" component={CreateEntityPage} />
            <Route path="/select-entity" component={SelectEntityPage} />
            <Route path="/logout" component={Logout} />
            <Route path="/" component={LivestockPage} />
        </Switch>
    </BrowserRouter>
    );
}