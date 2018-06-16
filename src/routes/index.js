import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from '../components/pages/accounts/login/LoginPage';
import RegistrationPage from '../components/pages/accounts/registration/RegistrationPage';
import ForgotPasswordPage from '../components/pages/accounts/forgotPassword/ForgotPasswordPage';
import DashboardPage from '../components/pages/livestock/dashboard/DashboardPage';

export default () => {
    return(
    <BrowserRouter>
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/livestock" component={DashboardPage} />
            <Route path="/" exact component={DashboardPage} />
        </Switch>
    </BrowserRouter>
    );
}