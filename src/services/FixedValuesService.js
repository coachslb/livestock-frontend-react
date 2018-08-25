import axios from 'axios';

import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

let FixedValuesService = {
  getCountries: function() {
    return axios.get(end.URL + end.VERSION + end.COUNTRIES).then(handleResponse);
  },
  getLanguages: function(){
    return axios.get(end.URL + end.VERSION + end.LANGUAGES).then(handleResponse);
  },
  getRegions: function(countryName){
    return axios.get(end.URL + end.VERSION + end.REGIONS + `?country=${countryName}`).then(handleResponse);
  },
  getExplorationTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.EXPLORATION_TYPES, config).then(handleResponse);
  },
  getProductionTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.PRODUCTION_TYPES, config).then(handleResponse);
  },
  getExplorationSystem: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.EXPLORATION_SYSTEM, config).then(handleResponse);
  },
  getPlaceTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.PLACE_TYPES, config).then(handleResponse);
  },
  getCropTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.CROP_TYPES, config).then(handleResponse);
  },
  getSoilTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.SOIL_TYPES, config).then(handleResponse);
  },
  getAnimalTypes: async function(explorationId, isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.EXPLORATION_TYPES + `?explorationId=${explorationId}`, config).then(handleResponse);
  },
  getSexTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.SEX, config).then(handleResponse);
  },
  getBreeds: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.BREEDS, config).then(handleResponse);
  },
  getDeathCauses: async function(isAuthenticated){
    let config = null;
    if(isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.DEATH_CAUSES, config).then(handleResponse);
  },
  getSanitaryEventTypes: async function(isAuthenticated){
    let config = null;
    if(isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.SANITARY_EVENT_TYPES, config).then(handleResponse);
  },
  getCoberturaTypes: async function(isAuthenticated){
    let config = null;
    if(isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.COBERTURA_TYPES, config).then(handleResponse);
  },
  getTranferTypes: async function(isAuthenticated){
    let config = null;
    if(isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.TRANSFER_TYPES, config).then(handleResponse);
  },
  getSellOrPurchase: async function(isAuthenticated){
    let config = null;
    if(isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.SELL_OR_PURCHASE_TYPES, config).then(handleResponse);
  },
};

export default FixedValuesService;
