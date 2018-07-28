import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService'; 

const ManagementSellOrPurchaseService = {
    createPurchase: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .post(end.URL + end.VERSION + end.MANAGEMENT + end.PURCHASE, data, config)
          .then(handleResponse);
      },
      updatePurchase: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .put(end.URL + end.VERSION + end.MANAGEMENT + end.PURCHASE, data, config)
          .then(handleResponse);
      },
      deletePurchase: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .delete(
            end.URL + end.VERSION + end.MANAGEMENT + end.PURCHASE + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
      getPurchase: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .get(
            end.URL + end.VERSION + end.MANAGEMENT + end.PURCHASE + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
      createSell: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .post(end.URL + end.VERSION + end.MANAGEMENT + end.SELL, data, config)
          .then(handleResponse);
      },
      updateSell: async function(data, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .put(end.URL + end.VERSION + end.MANAGEMENT + end.SELL, data, config)
          .then(handleResponse);
      },
      deleteSell: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .delete(
            end.URL + end.VERSION + end.MANAGEMENT + end.SELL + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
      getSell: async function(id, entityId, isAuthenticated) {
        let config = null;
        if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
        return axios
          .get(
            end.URL + end.VERSION + end.MANAGEMENT + end.SELL + `?id=${id}&entityId=${entityId}`,
            config,
          )
          .then(handleResponse);
      },
}

export default ManagementSellOrPurchaseService;