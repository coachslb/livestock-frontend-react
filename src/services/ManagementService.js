import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const ManagementService = {
  get: async function(entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.MANAGEMENT + `?entityId=${entityId}`, config).then(handleResponse);
  },
  getType: async function(managementId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.MANAGEMENT + end.MANAGEMENT_TYPE + `?managementId=${managementId}`, config).then(handleResponse);
  },
};

export default ManagementService;