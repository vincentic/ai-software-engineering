import axios from "axios";


const http = axios.create({
  baseURL: "http://localhost:3000",
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // You can add auth tokens or log requests here
    // console.log("Request:", config);
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // You can log responses or handle global success here
    // console.log("Response:", response);
    return response;
  },
  (error) => {
    // Handle response errors globally
    // Optionally show notification or log
    // console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default http;
