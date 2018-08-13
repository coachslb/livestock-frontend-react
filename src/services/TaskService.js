import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const TaskService = {
  get: async function(id, entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.TASK + `?agricolaEntityId=${entityId}`, config).then(handleResponse);
  },
  create: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.TASK, data, config).then(handleResponse);
  },
  update: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.TASK, data, config).then(handleResponse);
  },
  delete: async function(taskId, entityId, enabled, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.delete(end.URL + end.VERSION + end.TASK + `?id=${taskId}&agricolaEntityId=${entityId}&enabled=${enabled}`, config).then(handleResponse);
  },
};

export default TaskService;