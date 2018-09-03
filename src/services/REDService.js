import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponseExcel } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const REDService = {
  exportRED: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .post(end.URL + end.VERSION + end.EXPORT_RED, data, {
        ...config,
        responseType: 'blob',
      })
      .then(handleResponseExcel);
  },
};

export default REDService;
