import axios from "axios";

// const apikey = import.meta.env.VITE_API_KEY

const Url = 'https://sienna-woodpecker-844567.hostingersite.com/';
// const Url = 'https://darkgoldenrod-snail-243655.hostingersite.com/';

const axiosInstance = axios.create({
  baseURL: Url,
  //    baseURL: 'https://sienna-woodpecker-844567.hostingersite.com/',mageja6537@magpit.com
  // baseURL: 'https://sienna-woodpecker-844567.hostingersite.com',wikabe7534@excederm.com
});

// npm install react react-dom @mantine/core @mantine/notifications @mantine/hooks @mantine/form @tabler/icons-react recharts

axios.defaults.withCredentials = true;

// axiosInstance.interceptors.request.use(function (config) {
//    // Do something before request is sent
//   const token = localStorage.getItem('userToken');
//   if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//   }
//   return config;
//  }, function (error) {
//    // Do something with request error
//    return Promise.reject(error);
//  });

export default axiosInstance;
export const apiUrl = Url;
