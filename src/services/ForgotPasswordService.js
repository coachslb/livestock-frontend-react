import axios from 'axios';

import * as end from '../constants/EndPoints';
import { handleResponse, handleResponseError } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let ForgotPasswordService = {
  forgotPassword: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .put(
        end.URL +
          end.VERSION +
          end.PREFERENCES +
          end.FORGOT_PASSWORD_REQUEST +
          `?email=${data.email}&lang=${data.lang}`,
        {},
        config,
      )
      .then(handleResponse).catch(handleResponseError);
  },
  forgotPasswordConfirm: async function(token, newPassword, lang, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .put(
        end.URL +
          end.VERSION +
          end.PREFERENCES +
          end.FORGOT_PASSWORD_CONFIRM +
          `?token=${token}&newpassword=${newPassword}&lang=${lang}`,
        {},
        config,
      )
      .then(handleResponse);
  },
};

export default ForgotPasswordService;
