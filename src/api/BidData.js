import axios from 'axios';
import { API_URL } from './ApiURL';

export const getLatestBidData = async (idBoard) => {
  try {
    const response = await axios.get(`${API_URL}/bids/${idBoard}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Bid Data: ', error);
    throw error;
  }
};

export const createBids = async (idBoard, idUser, bid_price) => {
  const data = { idBoard, idUser, bid_price };
  try {
    const response = await axios.post(`${API_URL}/bids/create/`, data);
    return response.data;
  } catch (error) {
    console.error('Error create Bids table: ', error);
    throw error;
  }
};

export const updateBidStatus = async (idBoard, idBids) => {
  try {
    const response = await axios.put(`${API_URL}/bids/update/${idBids}`, {
      idBoard,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to update bid_status: ', error);
    throw error;
  }
};
