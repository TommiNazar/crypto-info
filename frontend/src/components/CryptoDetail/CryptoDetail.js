import React from 'react';
import Chart from '../Chart/Chart';
import '../../styles/main.scss';

const CryptoDetail = ({ coin, onBack, loading }) => {
  if (loading) {
    return <div className="loading">Cargando detalles...</div>;
  }

  if (!coin) {
    return <div className="error">No se encontraron detalles</div>;
  }

  const { detail, history } = coin;
  const isPositive = detail.market_data.price_change_percentage_24h >= 0;

  return (
    <div className="detail-view">
      <div className="detail-header">
        <h2>
          <img src={detail.image.small} alt={detail.name} />
          {detail.name} ({detail.symbol.toUpperCase()})
        </h2>
        <button className="back-button" onClick={onBack}>
          Volver al listado
        </button>
      </div>
      
      <div className="price-large">
        ${detail.market_data.current_price.usd.toLocaleString()}
        <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{detail.market_data.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
      
      <div className="market-data">
        <div className="data-item">
          <div className="label">Market Cap</div>
          <div className="value">${detail.market_data.market_cap.usd.toLocaleString()}</div>
        </div>
        
        <div className="data-item">
          <div className="label">Volumen (24h)</div>
          <div className="value">${detail.market_data.total_volume.usd.toLocaleString()}</div>
        </div>
        
        <div className="data-item">
          <div className="label">Máximo (24h)</div>
          <div className="value">${detail.market_data.high_24h.usd.toLocaleString()}</div>
        </div>
        
        <div className="data-item">
          <div className="label">Mínimo (24h)</div>
          <div className="value">${detail.market_data.low_24h.usd.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="chart-container">
        <h3>Historial de precios (7 días)</h3>
        <Chart data={history.prices} />
      </div>
    </div>
  );
};

export default CryptoDetail;