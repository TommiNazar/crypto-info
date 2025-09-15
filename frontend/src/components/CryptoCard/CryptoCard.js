import React from 'react';
import '../../styles/main.scss';

const CryptoCard = ({ crypto, onClick }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div className="crypto-card" onClick={onClick}>
      <div className="crypto-header">
        <div className="crypto-name">
          {crypto.name}
        </div>
        <div className="crypto-symbol">
          {crypto.symbol.toUpperCase()}
        </div>
      </div>
      
      <div className="crypto-price">
        ${crypto.current_price.toLocaleString()}
      </div>
      
      <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
      </div>
      
      <div className="crypto-market-cap">
        Market Cap: ${crypto.market_cap.toLocaleString()}
      </div>
    </div>
  );
};

export default CryptoCard;