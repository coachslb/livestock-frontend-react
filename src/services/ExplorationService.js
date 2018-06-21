import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const ExplorationService = {
  createExploration: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.EXPLORATION, data, config).then(handleResponse);
  },
  updateExploration: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.EXPLORATION, data, config).then(handleResponse);
  },
  get: async function(id, entityId, isAuthenticated) {
    let getValue = `?agricolaEntityId=${entityId}`;
    if(id)
        getValue = `?id=${id}`;
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.EXPLORATION + getValue, config).then(handleResponse);
  },
};

export default ExplorationService;