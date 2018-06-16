import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let EntityService = {
  createEntity: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    //if config is null return null for redirect to login
    console.log(config);
    console.log(data);
    return axios.post(end.URL + end.VERSION + end.AGRICOLA_ENTITY, data, config).then(handleResponse);
  },
};

export default EntityService;
