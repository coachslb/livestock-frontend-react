import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse, handleResponseError } from './HandleResponseService';

let AuthenticationService = {
  login: function(data) {
    return axios.post(end.URL + end.VERSION + end.LOGIN, data).then(handleResponse).catch(handleResponseError)
  },
  logout: function(data) {
    return axios.delete(end.URL + end.VERSION + end.LOGIN + end.LOGOUT + `?token=${data.token}`).then(handleResponse);
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
            console.log('device token');
            localStorage.setItem('token', res.data.token);
            expirationDate = new Date().getTime() + 900000
            localStorage.setItem('expirationDate', expirationDate);
            return res.data.token;
          });
      } else {
        if (new Date().getTime() + 300000 > expirationDate) {
          token = await axios
            .put(end.URL + end.VERSION + end.LOGIN + `?token=${token}`, {})
            .then(handleResponse)
            .then(res => {
              console.log('new login');
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('deviceToken', res.data.deviceToken);
              localStorage.setItem('language', res.data.language.code);
              localStorage.setItem('userId', res.data.userId);
              localStorage.setItem('username', res.data.username);
              expirationDate = new Date().getTime() + 900000
              localStorage.setItem('expirationDate', expirationDate);
              return res.data.token;
            });
        }
      }
    }

    //return header config
    return { headers: { Authorization: 'Bearer ' + token } };
  },
};

export default AuthenticationService;
