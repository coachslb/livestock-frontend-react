import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let EntityService = {
  createEntity: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.AGRICOLA_ENTITY, data, config).then(handleResponse);
  },
  getOneEntity: async function(entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.AGRICOLA_ENTITY + `?id=${entityId}`, config).then(handleResponse);
  },
  updateEntity: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.AGRICOLA_ENTITY, data, config).then(handleResponse);
  },
};

export default EntityService;
