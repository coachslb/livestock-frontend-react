import axios from 'axios';
import * as end from '../constants/EndPoints';
import { handleResponse } from './HandleResponseService';
import AuthenticationService from './AuthenticationService';

const AnimalService = {
  createAnimal: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.post(end.URL + end.VERSION + end.ANIMAL, data, config).then(handleResponse);
  },
  updateAnimal: async function(data, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.put(end.URL + end.VERSION + end.ANIMAL, data, config).then(handleResponse);
  },
  get: async function(id, explorationId, isAuthenticated) {
    let getValue = `?explorationId=${explorationId}`;
    if(id)
        getValue = `?id=${id}`;
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.ANIMAL + getValue, config).then(handleResponse);
  },
  deleteAnimal: async function(animalId, explorationId, enabled, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.delete(end.URL + end.VERSION + end.ANIMAL + `?id=${animalId}&explorationId=${explorationId}&enabled=${enabled}`, config).then(handleResponse);
  },
  getAnimalBySex: async function(sex, entityId, explorationId, isAuthenticated) {
    let config = null;
    if (isAuthenticated) config = await AuthenticationService.checkAndGetToken();
    return axios.get(end.URL + end.VERSION + end.ANIMAL + end.ANIMAL_SEX + `?sex=${sex}&entityId=${entityId}&explorationId=${explorationId}`, config).then(handleResponse);
  },
};

export default AnimalService;