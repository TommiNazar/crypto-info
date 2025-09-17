import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import CryptoList from './components/CryptoList/CryptoList';
import CryptoDetail from './components/CryptoDetail/CryptoDetail';
import { cryptoAPI } from './services/api';
import './styles/main.scss';

function App() {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoDetail, setCryptoDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Cargar lista de criptomonedas
  useEffect(() => {
    fetchCryptocurrencies();
    
    // Actualizar cada 60 segundos
    const interval = setInterval(fetchCryptocurrencies, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCryptocurrencies = async () => {
    try {
      setLoading(true);
      const response = await cryptoAPI.getCryptocurrencies();
      setCryptocurrencies(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching cryptocurrencies:', err);
      setError('Error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCrypto = async (coinId) => {
    try {
      setDetailLoading(true);
      const response = await cryptoAPI.getCoinDetail(coinId);
      setCryptoDetail(response.data);
      setSelectedCrypto(coinId);
    } catch (err) {
      console.error('Error fetching crypto details:', err);
      setError('Error al cargar los detalles. Intenta nuevamente.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCrypto(null);
    setCryptoDetail(null);
  };

  if (error && !cryptocurrencies.length) {
    return (
      <div className="app">
        <Header />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} />
      
      {selectedCrypto ? (
        <CryptoDetail 
          coin={cryptoDetail} 
          onBack={handleBackToList}
          loading={detailLoading}
        />
      ) : (
        <CryptoList 
          cryptocurrencies={cryptocurrencies} 
          onSelectCrypto={handleSelectCrypto}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;