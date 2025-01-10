import axios from 'axios';
import { API_URL } from './ApiURL';

export const createSuggest = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/suggest/create`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating suggest:', error);
    throw error;
  }
};

export const getSuggestByidBoard = async (idBoard, status) => {
  try {
    const response = await axios.get(`${API_URL}/suggest/${idBoard}/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggest data:', error);
    throw error;
  }
};
