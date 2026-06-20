import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8000/api', //apunta al servidor de laravel
  headers: {
    'Content-Type':'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');//para ver si se guardo el token en la local storag
    if(token){ //si el token existe se pega en la cabecera
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;}, (error) => {
    return Promise.reject(error);
  }
);
export default api;