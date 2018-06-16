import axios from 'axios'

import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let RegistrationService = {
    registration: async function (data, isAuthenticated) {
        let config = null
        if(isAuthenticated)
            config = await AuthenticationService.checkAndGetToken();
        return axios.post(end.URL + end.VERSION + end.REGISTRATION, data, config).then(handleResponse);
    }
}

export default RegistrationService;