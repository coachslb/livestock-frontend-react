import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const ResultsService = {
  getGeneralResults: async function(explorationId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.RESULTS_GENERAL + `?explorationId=${explorationId}`, config).then(handleResponse);
  },
  getAnimalResults: async function(explorationId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.RESULTS_ANIMAL + `?explorationId=${explorationId}`, config).then(handleResponse);
  },
  getManagementResults: async function(explorationId, type, beginDate, endDate, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.RESULTS_MANAGEMENT + `?explorationId=${explorationId}&type=${type}&begin=${beginDate}&end=${endDate}`, config).then(handleResponse);
  },
  getProductionResults: async function(explorationId, animalNumber, beginDate, endDate, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.RESULTS_PRODUCTION + `?explorationId=${explorationId}&animal=${animalNumber}&begin=${beginDate}&end=${endDate}`, config).then(handleResponse);
  },
}

export default ResultsService;