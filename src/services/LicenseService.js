import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const LicenseService = {
    getActiveLicense: async function(entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.LICENSE + `?agricolaEntityId=${entityId}`, config).then(handleResponse);
  },
};

export default LicenseService;