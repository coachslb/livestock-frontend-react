import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';

let AuthenticationService = {
  login: function(data) {
    return axios.post(end.URL + end.VERSION + end.LOGIN, data).then(handleResponse);
  },
  checkAndGetToken: async function() {
    //get token from localStorage
    let token = localStorage.getItem('token');
    let deviceToken = localStorage.getItem('deviceToken');
    if (token === null || token === '' || deviceToken === null) return null;
    //see browser history
    else {
      let expirationDate = localStorage.getItem('expirationDate');
      //login with device token
      if (expirationDate < new Date().getTime() && deviceToken) {
        token = await axios
          .post(end.URL + end.VERSION + end.LOGIN + end.DEVICE_TOKEN + `?token=${deviceToken}`, {})
          .then(handleResponse)
          .then(res => {
            //guarda dados novos
            //set da variavel token
            console.log(res);
          });
      } else {
        if (new Date().getTime() + 300000 < expirationDate) {
          token = await axios
            .put(end.URL + end.VERSION + end.LOGIN + `?token=${token}`, {})
            .then(handleResponse)
            .then(res => {
              //guarda dados novos
              //set da variavel token
              console.log(res);
            });
        }
      }
      //else if data de expiração está a 5 min, faz refresh token e guarda os novos dados da sessão e guarda token na variavel
      //else põe o token na variavel
    }

    //return header config
    return { headers: { Authorization: 'bearer ' + token } };
  },
};

export default AuthenticationService;
