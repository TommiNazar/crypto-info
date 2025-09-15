import React from 'react';
import CryptoCard from '../CryptoCard/CryptoCard';
import '../../styles/main.scss';

const CryptoList = ({ cryptocurrencies, onSelectCrypto, loading }) => {
  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (!cryptocurrencies || cryptocurrencies.length === 0) {
    return <div className="error">No se encontraron criptomonedas</div>;
  }

  return (
    <div className="crypto-grid">
      {cryptocurrencies.map(crypto => (
        <CryptoCard
          key={crypto.id}
          crypto={crypto}
          onClick={() => onSelectCrypto(crypto.id)}
        />
      ))}
    </div>
  );
};

export default CryptoList;