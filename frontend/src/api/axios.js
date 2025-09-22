//////////////////////////////////////////////
// Imports
//////////////////////////////////////////////
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000, 
  keepAlive: false 
});

export default apiClient;
