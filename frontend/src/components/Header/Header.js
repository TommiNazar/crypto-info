import React from 'react';
import '../../styles/main.scss';

const Header = ({ lastUpdated }) => {
  return (
    <header className="header">
      <h1>CryptoDashboard</h1>
      {lastUpdated && (
        <div className="last-updated">
          Última actualización: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </header>
  );
};

export default Header;