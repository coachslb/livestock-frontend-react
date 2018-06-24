import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let UserPreferencesService = {
  updateUser: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.PREFERENCES, data, config).then(handleResponse);
  },
  changeLang: async function(lang, userId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .put(
        end.URL + end.VERSION + end.PREFERENCES + end.LANGUAGE + `?lang=${lang}&userId=${userId}`,
        config,
      )
      .then(handleResponse);
  },
  changePassword: async function(currentPassword, newPassword, userId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .put(
        end.URL +
          end.VERSION +
          end.PREFERENCES +
          end.PASSWORD +
          `?currentPassword=${currentPassword}&newPassword=${newPassword}&userId=${userId}`,
        config,
      )
      .then(handleResponse);
  },
};

export default UserPreferencesService;
