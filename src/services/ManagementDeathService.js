import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const ManagementDeathService = {
    create: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .post(end.URL + end.VERSION + end.MANAGEMENT + end.DEATH, data, config)
          .then(handleResponse);
      },
      update: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .put(end.URL + end.VERSION + end.MANAGEMENT + end.DEATH, data, config)
          .then(handleResponse);
      },
      delete: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .delete(
            end.URL + end.VERSION + end.MANAGEMENT + end.DEATH + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
      get: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .get(
            end.URL + end.VERSION + end.MANAGEMENT + end.DEATH + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
}

export default ManagementDeathService;