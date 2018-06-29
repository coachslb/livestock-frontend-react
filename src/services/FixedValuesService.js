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
  getPlaceTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.PLACE_TYPES, config).then(handleResponse);
  },
  getSoilTypes: async function(isAuthenticated){
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.SOIL_TYPES, config).then(handleResponse);
  }
};

export default FixedValuesService;
