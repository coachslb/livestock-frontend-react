import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let WorkerService = {
  getWorkers: async function(entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .get(end.URL + end.VERSION + end.WORKER + `?agricolaEntityId=${entityId}`, config)
      .then(handleResponse);
  },
  getWorker: async function(id, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.WORKER + `?id=${id}`, config).then(handleResponse);
  },
  findByEmail: async function(email, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .get(end.URL + end.VERSION + end.WORKER + end.FIND_USER_EMAIL + `?email=${email}`, config)
      .then(handleResponse);
  },
  create: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.WORKER, data, config).then(handleResponse);
  },
  update: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.WORKER, data, config).then(handleResponse);
  },
  delete: async function(workerId, agricolaEntityId,  isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.delete(end.URL + end.VERSION + end.WORKER + `?workerId=${workerId}&agricolaEntityId=${agricolaEntityId}`, config).then(handleResponse);
  },
};

export default WorkerService;
