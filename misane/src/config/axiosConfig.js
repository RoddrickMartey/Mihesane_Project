import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use environment variable
  withCredentials: true, // Enable sending cookies with requests
});

export default axiosInstance;
