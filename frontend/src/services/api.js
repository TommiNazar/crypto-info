import axios from 'axios';

// La URL base de tu backend - cambiar por tu URL de producción cuando despliegues
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const cryptoAPI = {
  // Obtener lista de criptomonedas
  getCryptocurrencies: () => {
    return api.get('/api/cryptocurrencies');
  },
  
  // Obtener detalles de una criptomoneda específica
  getCoinDetail: (coinId) => {
    return api.get(`/api/cryptocurrencies/${coinId}`);
  }
};

export default api;