import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const PlaceService = {
  createPlace: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.PLACE, data, config).then(handleResponse);
  },
  updatePlace: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.PLACE, data, config).then(handleResponse);
  },
  get: async function(id, explorationId, isAuthenticated) {
    let getValue = `?explorationId=${explorationId}`;
    if(id)
        getValue = `?id=${id}`;
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.PLACE + getValue, config).then(handleResponse);
  },
  deletePlace: async function(placeId, explorationId, enabled, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.delete(end.URL + end.VERSION + end.PLACE + `?id=${placeId}&explorationId=${explorationId}&enabled=${enabled}`, config).then(handleResponse);
  },
};

export default PlaceService;
