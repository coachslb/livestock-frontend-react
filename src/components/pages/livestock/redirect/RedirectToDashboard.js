import React from 'react';
import { Redirect } from 'react-router-dom';

const RedirectToDashboard = props => {

  let redirectToDashboard = <Redirect to="/livestock" />;

  return redirectToDashboard;
};

export default RedirectToDashboard;
