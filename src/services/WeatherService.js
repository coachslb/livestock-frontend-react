import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const WeatherService = {
  getWeatherResume: async function(entityId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios
      .get(end.URL + end.VERSION + end.WEATHER_RESUME + `?agricolaEntityId=${entityId}`, config)
      .then(handleResponse);
  },
  getWeather: async function(placeId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.WEATHER + `?placeId=${placeId}`, config).then(handleResponse);
  },
};

export default WeatherService;