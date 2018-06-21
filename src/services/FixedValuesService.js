import axios from 'axios';

import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';

let FixedValuesService = {
  getCountries: function() {
    return axios.get(end.URL + end.VERSION + end.COUNTRIES).then(handleResponse);
  },
  getLanguages: function(){
    return axios.get(end.URL + end.VERSION + end.LANGUAGES).then(handleResponse);
  },
  getRegions: function(countryName){
    return axios.get(end.URL + end.VERSION + end.REGIONS + `?country=${countryName}`).then(handleResponse);
  }
};

export default FixedValuesService;
