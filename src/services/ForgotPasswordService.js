import axios from 'axios';

import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let ForgotPasswordService = {
  forgotPassword: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .put(end.URL + end.VERSION + end.PREFERENCES + end.FORGOT_PASSWORD + `?email=${data.email}&lang=${data.lang}`, {}, config)
      .then(handleResponse);
  },
};

export default ForgotPasswordService;
